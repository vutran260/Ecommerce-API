import { QueryTypes } from 'sequelize';
import { lpSequelize } from '../../lib/mysql/Connection';
import {
  LP_BUYER,
  LP_BUYERCreationAttributes,
} from '../../lib/mysql/models/LP_BUYER';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';
import { LP_ADDRESS_BUYER_SSO } from '../../lib/mysql/models/LP_ADDRESS_BUYER_SSO';
import { LP_BUYER_PERSONAL_INFORMATION } from '../../lib/mysql/models/LP_BUYER_PERSONAL_INFORMATION';

export class BuyerRepository {
  public createBuyer = async (input: LP_BUYERCreationAttributes) => {
    const buyer = await LP_BUYER.create(input);
    return await this.getBuyerById(buyer.id);
  };


  public getBuyerInfo = async (buyerId: string) => {
    try {
      LP_BUYER.hasOne(LP_ADDRESS_BUYER_SSO, {
        foreignKey: 'buyer_id',
        as: 'addressInfo', // Đảm bảo rằng alias này khớp
      });
      LP_BUYER.hasOne(LP_BUYER_PERSONAL_INFORMATION, {
        foreignKey: 'buyer_id',
        as: 'personalInfo', // Đảm bảo rằng alias này khớp
      });
      const buyerInfo = await LP_BUYER.findOne({
        where: { id: buyerId },
        include: [
          {
            model: LP_ADDRESS_BUYER_SSO,
            as: 'addressInfo' // Đặt tên alias cho association
          },
          {
            model: LP_BUYER_PERSONAL_INFORMATION,
            as: 'personalInfo' // Đặt tên alias cho association
          }
        ]
      });

      return buyerInfo;
    } catch (error) {
      console.error('Error fetching buyer info:', error);
      throw error;
    }
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
