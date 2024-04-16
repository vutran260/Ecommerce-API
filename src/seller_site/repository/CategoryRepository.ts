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
import { Attributes, FindAndCountOptions, Op, QueryTypes } from 'sequelize';
import { range } from 'lodash';
import MovePositionRequest from '../requests/categories/MovePositionRequest';
import { CategoryTypeAction, CategoryValue } from '../../lib/constant/Category';

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

  public deleteCategory = async (ids: string[]) => {
    try {
      ids.length > 0 &&
        ids.forEach(async (id) => {
          const category = await this.getCategoryId(id);
          return await category.destroy();
        });
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

  public getCategoriesWithHierarchy = async (storeId: string, id = '') => {
    const query =
      `
        WITH RECURSIVE cte AS
        (
            SELECT *,
                   CAST(id AS CHAR(200)) AS path,
                   0 as depth FROM LP_CATEGORY 
                   WHERE store_id = "${storeId}" AND ` +
      (!id ? `parent_id IS NULL ` : `id = "${id}" `) +
      `UNION ALL
            SELECT c.*, 
                   CONCAT(cte.path, ",", c.id),
                   cte.depth+1
            FROM LP_CATEGORY c JOIN cte ON
            cte.id=c.parent_id
          )
          SELECT * FROM cte ORDER BY depth ASC, order_level ASC;
        `;

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
      const test: any = this.getCategoriesTheSameLevel(category.id);
      if (category.parentId === null) {
        delete category.children;
        out.push(category);
        continue;
      }

      const parentCate = mapCte.get(category.parentId!);

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

  public moveUpCategory = async (input: MovePositionRequest, id: string) => {
    try {
      const categoriesTheSameLevel = await this.getCategoriesTheSameLevel(
        input.parentId,
      );

      const category = await this.getCategoryId(id);
      if (input.parentId != null) {
        await this.getCategoryId(input.parentId);
      }

      categoriesTheSameLevel.length > 0 &&
        categoriesTheSameLevel.map((res: any) => {
          switch (input.typeAction) {
            case CategoryTypeAction.UP:
              if (
                res.orderLevel ==
                category.orderLevel - CategoryValue.VALUE_ONE
              ) {
                res.orderLevel += CategoryValue.VALUE_ONE;
                res.save();
              }
              break;
            case CategoryTypeAction.DOWN:
              if (
                res.orderLevel ==
                category.orderLevel + CategoryValue.VALUE_ONE
              ) {
                res.orderLevel -= CategoryValue.VALUE_ONE;
                res.save();
              }
              break;
            case CategoryTypeAction.TOP:
              if (res.orderLevel < category.orderLevel) {
                res.orderLevel++;
                res.save();
              }
              break;
            case CategoryTypeAction.BOTTOM:
              if (res.orderLevel > category.orderLevel) {
                res.orderLevel--;
                res.save();
              }
              break;
            default:
          }
        });

      switch (input.typeAction) {
        case CategoryTypeAction.UP:
          category.orderLevel -= CategoryValue.VALUE_ONE;
          category.save();
          break;
        case CategoryTypeAction.DOWN:
          category.orderLevel += CategoryValue.VALUE_ONE;
          category.save();
          break;
        case CategoryTypeAction.TOP:
          category.orderLevel = CategoryValue.VALUE_ONE;
          category.save();
          break;
        case CategoryTypeAction.BOTTOM:
          category.orderLevel = categoriesTheSameLevel.length;
          category.save();
          break;
        default:
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoriesTheSameLevel = async (parentId?: string) => {
    const options: Omit<
      FindAndCountOptions<Attributes<LP_CATEGORY>>,
      'group'
    > = {};

    const whereOptions: any = {};
    whereOptions.parentId = parentId;
    options.where = whereOptions;

    const categories = await LP_CATEGORY.findAll({
      ...options,
    });

    return categories;
  };
}

class CategoryHierarchie extends LP_CATEGORY {
  path: string;
  depth: number;
  children?: CategoryHierarchie[];
}
