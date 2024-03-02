import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../lib/mysql/schema';
import Logger from '../../lib/core/Logger';
import { eq } from 'drizzle-orm';
import {
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
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

      const results = await this.db
        .insert(schema.category)
        .values(categoryCreateRequest)
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
      await this.getCategoryId(id);
      if (categoryCreateRequest.parent_id != null) {
        await this.getCategoryId(categoryCreateRequest.parent_id);
      }
      const results = await this.db
        .update(schema.category)
        .set(categoryCreateRequest)
        .where(eq(schema.category.id, id))
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteCategory = async (id: string) => {
    try {
      await this.getCategoryId(id);
      const results = await this.db
        .delete(schema.category)
        .where(eq(schema.category.id, id))
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getCategoryId = async (id: string) => {
    const result = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, id));
    if (result.length < 1) {
      throw new NotFoundError();
    }
    return result[0];
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
