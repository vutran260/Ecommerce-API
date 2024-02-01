import Logger from '../../lib/core/Logger';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { seller, user } from '../../lib/posgres/schema';
import *  as schema from '../../lib/posgres/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError } from '../../lib/core/ApiError';

export class sellerRepository {
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public createSeller = async (input: any) => {
    try {
      const result =   await this.getSellerById(input.id)
      if (result != null) {
        throw new BadRequestError("seller already registered")
      }
      const rs = await this.db.insert(seller).values(input)
      return this.getSellerById(input.id)

    } catch (e: any) {
      Logger.error(e.message);
      throw e
    }

  };

  public getSellerById = async (id: string) => {
    const result =   await this.db.select().from(seller).where(eq(seller.id, id))
    if (result.length < 1) {
      return null
    }
    return result[0]

  };
}