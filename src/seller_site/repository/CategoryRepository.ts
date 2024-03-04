import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../lib/mysql/schema';
import Logger from '../../lib/core/Logger';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  Filter,
  Paging,
  getColumnFunc,
  getRepoFilter,
} from '../../lib/paging/Request';
import { PgColumn } from 'drizzle-orm/pg-core';
import CategoryCreateRequest from '../../admin_site/requests/categories/CategoryCreateRequest';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MySqlColumn } from 'drizzle-orm/mysql-core';
import { LP_CATEGORY } from '../../lib/mysql/models/LP_CATEGORY';

export class CategoryRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public createCategory = async (
    categoryCreateRequest: CategoryCreateRequest,
  ) => {
    try {
      if (categoryCreateRequest.parent_id != null) {
        await this.getCategoryId(categoryCreateRequest.parent_id);
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
      if (categoryCreateRequest.parent_id != null) {
        await this.getCategoryId(categoryCreateRequest.parent_id);
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
      const query = getRepoFilter(filter, this.getColumn);
      const results = await this.db.select().from(schema.category).where(query);
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };

  private getColumn: getColumnFunc = (colName: string): MySqlColumn => {
    return this.columnMap.get(colName)!;
  };

  private columnMap = new Map<string, MySqlColumn>([
    ['id', schema.Product.id],
    ['product_name', schema.Product.productName],
  ]);
}
