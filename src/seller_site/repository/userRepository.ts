import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { seller } from '../../lib/posgres/schema';

export class UserRepository {
  // private userRepo: userRepo
  private db:  PostgresJsDatabase;


  constructor(db:  PostgresJsDatabase) {
    this.db = db;
  }

  public createUser = async (input: any) => {
    try {
      const results = await this.db.insert(seller).values(input);
      return  await this.db.select().from(seller)
    } catch (e: any) {
      Logger.error(e.message);
      return e
    }
  };

}
