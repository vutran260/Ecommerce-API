import Logger from '../../lib/core/Logger';
import {
  DataExists,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
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

      const existingCategoryName = await LP_CATEGORY.findOne({
        where: {
          categoryName: categoryCreateRequest.categoryName,
        },
      });
      if (existingCategoryName) {
        throw new DataExists();
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
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        const category = await this.getCategoryId(id);

        // Get all the same category parent.
        const categoriesTheSameLevel: any[any] =
          await this.getCategoriesTheSameLevel(category?.parentId);

        // Filter categories have filed order level grater of order level category input
        const filterCategories = await categoriesTheSameLevel.filter(
          (res: any) => res.id != category.id,
        );
        await category.destroy();
        if (filterCategories.length > 0) {
          filterCategories.forEach(async (res: any, index: number) => {
            const updateCategory: CategoryCreateRequest = {
              parentId: filterCategories[index]?.dataValues.parentId,
              storeId: filterCategories[index]?.dataValues.storeId,
              categoryName: filterCategories[index]?.dataValues.categoryName,
              categoryTag: filterCategories[index]?.dataValues.categoryTag,
              status: filterCategories[index]?.dataValues.status,
              orderLevel: index + 1,
            };
            await this.updateCategory(
              updateCategory,
              filterCategories[index].dataValues.id,
            );
          });
        }
      }
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
      'WITH RECURSIVE cte AS ' +
      '(SELECT a.*, a.id AS path, 0 as depth, ' +
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
      // const test: any = this.getCategoriesTheSameLevel(category.id);
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

  public moveUpCategory = async (input: MovePositionRequest, id: string) => {
    try {
      const category = await this.getCategoryId(id);
      if (input.parentId != null) {
        await this.getCategoryId(input.parentId);
      }

      const categoriesTheSameLevel = await this.getCategoriesTheSameLevel(
        category.parentId,
      );

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

    return await categories;
  };
}

class CategoryHierarchie extends LP_CATEGORY {
  brotherCount: number;
  path: string;
  depth: number;
  children?: CategoryHierarchie[];
}
