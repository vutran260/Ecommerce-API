import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../lib/posgres/schema';
import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import Logger from '../../lib/core/Logger';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class ProductRepository {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    try {
      const results = await this.db
        .insert(schema.product)
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
        .update(schema.product)
        .set(productCreateRequest)
        .where(eq(schema.product.id, id))
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
        .delete(schema.product)
        .where(eq(schema.product.id, id))
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
      .from(schema.product)
      .where(eq(schema.product.id, id));
    if (result.length < 1) {
      throw new NotFoundError();
    }
    return result[0];
  };
}
