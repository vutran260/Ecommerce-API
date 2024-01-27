import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { buyer } from '../../lib/posgres/schema';

export class UserRepository {
  private db:  PostgresJsDatabase;


  constructor(db:  PostgresJsDatabase) {
    this.db = db;
  }

  public createUser = async (input: any) => {
    try {
      const results = await this.db.insert(buyer).values(input);
      return  await this.db.select().from(buyer)
    } catch (e: any) {
      Logger.error(e.message);
      return e
    }
  };

}
