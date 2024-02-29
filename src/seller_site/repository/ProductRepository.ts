import * as schema from '../../lib/mysql/schema';
import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import Logger from '../../lib/core/Logger';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { Filter, Paging, getColumnFunc, getRepoFilter } from '../../lib/paging/Request';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MySqlColumn } from 'drizzle-orm/mysql-core';

export class ProductRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    try {
      const results = await this.db
        .insert(schema.Product)
        .values(productCreateRequest)
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
        .update(schema.Product)
        .set(productCreateRequest)
        .where(eq(schema.Product.id, id))
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
        .delete(schema.Product)
        .where(eq(schema.Product.id, id))
      return results;
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getProductId = async (id: string) => {
    const result = await this.db
      .select()
      .from(schema.Product)
      .where(eq(schema.Product.id, id));
    if (result.length < 1) {
      throw new NotFoundError();
    }
    return result[0];
  };

  public getProducts = async (filter: Filter[], paging: Paging) => {
    try {
      const query = getRepoFilter(filter, this.getColumn);
      const results = await this.db.select().from(schema.Product).where(query);
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  }

  private getColumn: getColumnFunc = (colName: string): MySqlColumn => {
    return this.columnMap.get(colName)!;
  };

  private columnMap = new Map<string, MySqlColumn>([
    ['id', schema.Product.id],
    ['product_name', schema.Product.productName],
  ]);
}

