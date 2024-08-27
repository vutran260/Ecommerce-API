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
import CategoryCreateRequest from '../../common/model/categories/CategoryCreateRequest';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';
import { lpSequelize } from '../../lib/mysql/Connection';
import {
  Attributes,
  FindAndCountOptions,
  QueryTypes,
  Transaction,
} from 'sequelize';
import MovePositionRequest from '../../common/model/categories/MovePositionRequest';
import { CategoryTypeAction, CategoryValue } from '../../lib/constant/Category';
import { LP_PRODUCT_CATEGORY } from '../../lib/mysql/models/LP_PRODUCT_CATEGORY';

export class CategoryRepository {
  public createCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
    storeId: string,
    t?: Transaction,
  ) => {
    try {
      if (categoryCreateRequest.parentId != null) {
        await this.getCategoryId(categoryCreateRequest.parentId, storeId, t);
      }

      const existingCategoryName = await LP_CATEGORY.findOne({
        where: {
          categoryName: categoryCreateRequest.categoryName,
          storeId: storeId,
        },
        transaction: t,
      });
      if (existingCategoryName) {
        throw new DataExists();
      }

      const results = await LP_CATEGORY.create(categoryCreateRequest, {
        transaction: t,
      })
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
    storeId: string,
    t?: Transaction,
  ) => {
    try {
      const category = await this.getCategoryId(id, storeId, t);
      if (categoryCreateRequest.parentId != null) {
        await this.getCategoryId(categoryCreateRequest.parentId, storeId, t);
      }
      const existingCategoryName = await LP_CATEGORY.findOne({
        where: {
          categoryName: categoryCreateRequest.categoryName,
          storeId: storeId,
        },
        transaction: t,
      });
      if (existingCategoryName) {
        throw new DataExists();
      }

      if (category) {
        return await category.update(categoryCreateRequest, { transaction: t });
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteCategory = async (
    ids: string[],
    storeId: string,
    t?: Transaction,
  ) => {
    try {
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        const category = await this.getCategoryId(id, storeId, t);

        // Get all the same category parent.
        const categoriesTheSameLevel: any[any] =
          await this.getCategoriesTheSameLevel(category?.parentId, storeId, t);

        // Filter categories have filed order level grater of order level category input
        const filterCategories = await categoriesTheSameLevel.filter(
          (res: any) => res.id != category.id,
        );
        await LP_PRODUCT_CATEGORY.destroy({
          where: {
            categoryId: id,
          },
          transaction: t,
        });
        await category.destroy({ transaction: t });

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
              storeId,
              t,
            );
          });
        }
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoryId = async (
    id: string,
    storeId: string,
    t?: Transaction,
  ) => {
    const result = await LP_CATEGORY.findOne({
      where: {
        id: id,
        storeId: storeId,
      },
      transaction: t,
    });
    if (result) {
      return result;
    } else {
      throw new NotFoundError();
    }
  };

  public getCategories = async (
    filter: Filter[],
    paging: Paging,
    t?: Transaction,
  ) => {
    try {
      const count = await LP_CATEGORY.count({
        where: BuildQuery(filter),
        transaction: t,
      });
      paging.total = count;

      const results = await LP_CATEGORY.findAll({
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        limit: paging.limit,
        transaction: t,
      });
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };

  public getAllLeafInSub = async (
    categoryId: string,
    t?: Transaction,
  ): Promise<string[]> => {
    const query =
      'WITH RECURSIVE cte AS ' +
      '(SELECT a.id, a.parent_id ' +
      `FROM LP_CATEGORY as a ` +
      `WHERE a.id = '${categoryId}' ` +
      'UNION ALL ' +
      'SELECT c.id, c.parent_id ' +
      'FROM LP_CATEGORY c ' +
      'JOIN cte ON cte.id = c.parent_id ) ' +
      'SELECT * FROM cte where id NOT IN (SELECT parent_id FROM cte WHERE parent_id IS NOT NULL)';
    const record = await lpSequelize.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      transaction: t,
    });

    return record.map((res: any) => res.id);
  };

  public getCategoriesWithHierarchy = async (
    storeId: string,
    id = '',
    t?: Transaction,
  ) => {
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
      `SELECT 
        *,
        ( 
	        SELECT count(DISTINCT lpc.product_id ) 
          FROM LP_PRODUCT_CATEGORY lpc 
          LEFT JOIN LP_PRODUCT lp ON lpc.product_id = lp.id 
          WHERE 
            category_id in 
              ( 
              SELECT CASE 
                WHEN vpp.id IS NOT NULL THEN vpp.id 
                WHEN vp.id IS NOT NULL THEN vp.id 
                ELSE v.id END AS VCL 
              FROM LP_CATEGORY AS v 
              LEFT JOIN LP_CATEGORY AS vp ON v.id = vp.parent_id 
              LEFT JOIN LP_CATEGORY AS vpp ON vp.id = vpp.parent_id 
              WHERE v.id = cte.id
              ) 
              AND lp.is_deleted = 0
        ) AS productsCount
      FROM 
          cte 
      ORDER BY 
      depth ASC, order_level ASC; `;

    const record = await lpSequelize.query(query, {
      raw: true,
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: CategoryHierarchie,
      transaction: t,
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

  public moveUpCategory = async (
    input: MovePositionRequest,
    id: string,
    storeId: string,
    t?: Transaction,
  ) => {
    try {
      const category = await this.getCategoryId(id, storeId, t);
      if (input.parentId != null) {
        await this.getCategoryId(input.parentId, storeId, t);
      }

      const categoriesTheSameLevel = await this.getCategoriesTheSameLevel(
        category.parentId,
        storeId,
        t,
      );

      categoriesTheSameLevel.length > 0 &&
        categoriesTheSameLevel.map((res: LP_CATEGORY) => {
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
                res.save({ transaction: t });
              }
              break;
            case CategoryTypeAction.TOP:
              if (res.orderLevel < category.orderLevel) {
                res.orderLevel++;
                res.save({ transaction: t });
              }
              break;
            case CategoryTypeAction.BOTTOM:
              if (res.orderLevel > category.orderLevel) {
                res.orderLevel--;
                res.save({ transaction: t });
              }
              break;
            default:
          }
        });

      switch (input.typeAction) {
        case CategoryTypeAction.UP:
          category.orderLevel -= CategoryValue.VALUE_ONE;
          category.save({ transaction: t });
          break;
        case CategoryTypeAction.DOWN:
          category.orderLevel += CategoryValue.VALUE_ONE;
          category.save({ transaction: t });
          break;
        case CategoryTypeAction.TOP:
          category.orderLevel = CategoryValue.VALUE_ONE;
          category.save({ transaction: t });
          break;
        case CategoryTypeAction.BOTTOM:
          category.orderLevel = categoriesTheSameLevel.length;
          category.save({ transaction: t });
          break;
        default:
      }
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoriesTheSameLevel = async (
    parentId?: string,
    storeId?: string,
    t?: Transaction,
  ) => {
    const options: Omit<
      FindAndCountOptions<Attributes<LP_CATEGORY>>,
      'group'
    > = {};

    const whereOptions: any = {};
    whereOptions.parentId = parentId;
    whereOptions.storeId = storeId;
    options.where = whereOptions;

    const categories = await LP_CATEGORY.findAll({
      ...options,
      order: [['orderLevel', 'ASC']],
      transaction: t,
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
