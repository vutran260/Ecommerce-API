import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../lib/posgres/schema';
import { admin, seller } from '../../lib/posgres/schema';
import Logger from '../../lib/core/Logger';
import {
  Filter,
  getColumnFunc,
  getRepoFilter,
  Paging,
} from '../../lib/paging/Request';
import { PgColumn } from 'drizzle-orm/pg-core';
import ProductCreateRequest from '../requests/products/ProductCreateRequest';
import { product } from '../../lib/posgres/schema';
import { eq } from 'drizzle-orm';
import { ResponseData } from '../../lib/http/Response';
import { Response } from 'express';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class SellerRepository {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getSeller = async (filter: Filter[], paging: Paging) => {
    try {
      const query = getRepoFilter(filter, this.getColumn);
      console.log('query', filter);
      const results = await this.db.select().from(seller).where(query);
      return results;
    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e;
    }
  };

  private getColumn: getColumnFunc = (colName: string): PgColumn => {
    return this.columnMap.get(colName)!;
  };

  private columnMap = new Map<string, PgColumn>([
    ['id', seller.id],
    ['username', seller.username],
  ]);

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    try {
      const results = await this.db
        .insert(product)
        .values(productCreateRequest)
        .returning();
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public updateProduct = async (
    productCreateRequest: ProductCreateRequest,
    id: string,
  ) => {
    try {
      await this.getProductId(id);
      const results = await this.db
        .update(product)
        .set(productCreateRequest)
        .where(eq(product.id, id))
        .returning();
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public deleteProduct = async (id: string) => {
    try {
      await this.getProductId(id);
      const results = await this.db
        .delete(product)
        .where(eq(product.id, id))
        .returning();
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getProductId = async (id: string) => {
    const result = await this.db
      .select()
      .from(product)
      .where(eq(product.id, id));
    if (result.length < 1) {
      throw new NotFoundError();
    }
    return result[0];
  };
}
