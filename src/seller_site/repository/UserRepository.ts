import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Seller, User } from '../../lib/mysql/schema';
import * as schema from '../../lib/mysql/schema';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

export class UserRepository {
  // private userRepo: userRepo
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getUserById = async (id: string) => {
    try {

      const result =   await this.db.select().from(User).where(eq(User.id, id))
      if (result.length < 1) {
        return null
      }
      return result[0]

    } catch (e: any) {
      Logger.error(e.message);
      throw e
    }
  };

  public createUser =  async (input: any) => {
    try {
      const result = await this.db.insert(User).values(input)

      return this.getUserById(input.id)
    }catch (e:any) {
      Logger.error(e?.message);
      throw e
    }
  }

}
