import Logger from '../../lib/core/Logger';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';
import { lpSequelize } from '../../lib/mysql/Connection';
import { QueryTypes } from 'sequelize';

export class CategoryRepository {
  public getCategoryId = async (id: string, storeId: string) => {
    const result: any = await LP_CATEGORY.findOne({
      where: {
        id: id,
        storeId: storeId,
      },
    });
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

  public getAllLeafInSub = async (categoryId: string): Promise<string[]> => {
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
    });

    return record.map((res: any) => res.id);
  };
}
