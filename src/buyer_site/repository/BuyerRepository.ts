import { QueryTypes } from 'sequelize';
import { lpSequelize } from '../../lib/mysql/Connection';
import {
  LP_BUYER,
  LP_BUYERCreationAttributes,
} from '../../lib/mysql/models/LP_BUYER';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';

export class BuyerRepository {
  public createBuyer = async (input: LP_BUYERCreationAttributes) => {
    const buyer = await LP_BUYER.create(input);
    return await this.getBuyerById(buyer.id);
  };

  public getBuyerById = async (id: string) => {
    const result = await LP_BUYER.findOne({ where: { id: id } });
    return result?.dataValues;
  };

  public getCategoriesWithHierarchy = async (storeId: string, id = '') => {
    const query =
      'WITH RECURSIVE cte AS ' +
      '(SELECT a.*, CAST(a.id AS CHAR(200)) AS path, 0 as depth, ' +
      `(SELECT count(*) from LP_CATEGORY where store_id = '${storeId}' ` +
      (!id
        ? 'AND parent_id IS NULL) as brotherCount '
        : `AND parent_id = (SELECT parent_id FROM LP_CATEGORY where id = '${id}')) as brotherCount `) +
      `FROM LP_CATEGORY as a WHERE store_id = '${storeId}' AND ` +
      (!id ? 'parent_id IS NULL ' : `id = '${id}' `) +
      'UNION ALL ' +
      "SELECT c.*, CONCAT(cte.path, ',', c.id), cte.depth + 1, " +
      '(SELECT count(*) from LP_CATEGORY where parent_id = ( SELECT parent_id FROM LP_CATEGORY where id = c.id)) as brotherCount ' +
      'FROM LP_CATEGORY c ' +
      'JOIN cte ON cte.id = c.parent_id ) ' +
      'SELECT * FROM cte ORDER BY depth ASC, order_level ASC;';

    const record = await lpSequelize.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: CategoryHierarchie,
    });
    const out: CategoryHierarchie[] = [];
    const mapCte = new Map<string, CategoryHierarchie>();
    for (const category of record) {
      mapCte.set(category.id, category);
      if (
        category.parentId === null ||
        (category.parentId && !mapCte.has(category.parentId))
      ) {
        delete category.children;
        out.push(category);
        continue;
      }

      const parentCate = mapCte.get(category.parentId!);
      // parent exist
      if (!!parentCate && !parentCate?.children) {
        parentCate.children = [];
      }
      parentCate?.children?.push(category);
      if (parentCate?.children?.length == 0) {
        delete parentCate.children;
      }
    }

    return out;
  };
}

class CategoryHierarchie extends LP_CATEGORY {
  brotherCount: number;
  path: string;
  depth: number;
  children?: CategoryHierarchie[];
}
