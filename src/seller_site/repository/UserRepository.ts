import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { seller, user } from '../../lib/posgres/schema';
import * as schema from '../../lib/posgres/schema';
import { eq } from 'drizzle-orm';

export class UserRepository {
  // private userRepo: userRepo
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getUserById = async (id: string) => {
    try {

      const result =   await this.db.select().from(user).where(eq(user.id, id))
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
      const result = await this.db.insert(user).values(input)

      return this.getUserById(input.id)
    }catch (e:any) {
      Logger.error(e?.message);
      throw e
    }
  }

}
