import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import CategoryCreateRequest from '../requests/categories/CategoryCreateRequest';
import {
  LP_CATEGORY,
  LP_CATEGORYAttributes,
} from '../../lib/mysql/models/LP_CATEGORY';
import { Sequelize } from 'sequelize-typescript';
import { lpSequelize } from '../../lib/mysql/Connection';
import { QueryTypes } from 'sequelize';
import { range } from 'lodash';

export class CategoryRepository {
  public createCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
  ) => {
    try {
      if (categoryCreateRequest.parentId != null) {
        await this.getCategoryId(categoryCreateRequest.parentId);
      }

      const results = await LP_CATEGORY.create(categoryCreateRequest)
        .then((category) => {
          return category.dataValues;
        })
        .catch((err) => {
          throw err;
        });
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public updateCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
    id: string,
  ) => {
    try {
      const category = await this.getCategoryId(id);
      if (categoryCreateRequest.parentId != null) {
        await this.getCategoryId(categoryCreateRequest.parentId);
      }
      if (category) {
        return await category.update(categoryCreateRequest);
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteCategory = async (id: string) => {
    try {
      const category = await this.getCategoryId(id);
      return await category.destroy();
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoryId = async (id: string) => {
    const result: any = await LP_CATEGORY.findByPk(id);
    if (result) {
      return result;
    } else {
      throw new NotFoundError();
    }
  };

  public getCategories = async (filter: Filter[], paging: Paging) => {
    try {
      const count = await LP_CATEGORY.count({
        where: BuildQuery(filter),
      });
      paging.total = count;

      const results = await LP_CATEGORY.findAll({
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        limit: paging.limit,
      });
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoriesWithHierarchy = async (storeId: string ,id = "") => {
    const query =
      `
        WITH RECURSIVE cte AS
        (
            SELECT *,
                   CAST(id AS CHAR(200)) AS path,
                   0 as depth FROM LP_CATEGORY 
                   WHERE store_id = "${storeId}" AND ` + 
                   (!id
        ? `parent_id IS NULL `
        : `id = "${id}" `) +
          `UNION ALL
            SELECT c.*, 
                   CONCAT(cte.path, ",", c.id),
                   cte.depth+1
            FROM LP_CATEGORY c JOIN cte ON
            cte.id=c.parent_id
          )
          SELECT * FROM cte ORDER BY path;
        `;

        
    const record = await lpSequelize.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: CategoryHierarchie,
    });

    const out: CategoryHierarchie[] = [];
    const mapCte = new Map<string, CategoryHierarchie>();
    for (const category  of record) {
      mapCte.set(category.id, category)
      
      if (category.parentId === null) {
        category.children = [];
        out.push(category);
        continue;
      }
      
      const parentCate = mapCte.get(category.parentId!);

      if (!!parentCate && !parentCate?.children) {
        parentCate.children = []
      }
      parentCate?.children?.push(category)
    }

    return out;
  };
}

class CategoryHierarchie extends LP_CATEGORY {
  path: string;
  depth: number;
  children?: CategoryHierarchie[];
}
