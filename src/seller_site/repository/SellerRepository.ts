import Logger from '../../lib/core/Logger';
import { Seller } from '../../lib/mysql/schema';
import *  as schema from '../../lib/mysql/schema';
import { eq } from 'drizzle-orm';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { MySql2Database } from 'drizzle-orm/mysql2';

export class SellerRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public createSeller = async (input: any) => {
    try {
      const result =   await this.getSellerById(input.id)
      if (result != null) {
        throw new BadRequestError("seller already registered")
      }
      const rs = await this.db.insert(Seller).values(input)
      return this.getSellerById(input.id)

    } catch (e: any) {
      Logger.error(e.message);
      throw e
    }

  };

  public getSellerById = async (id: string) => {
    const result =   await this.db.select().from(Seller).where(eq(Seller.id, id))
    if (result.length < 1) {
      return null
    }
    return result[0]

  };
}