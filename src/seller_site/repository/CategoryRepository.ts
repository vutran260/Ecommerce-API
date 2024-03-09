import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import CategoryCreateRequest from '../../admin_site/requests/categories/CategoryCreateRequest';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';

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
}
