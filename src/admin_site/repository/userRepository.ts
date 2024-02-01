import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { admin } from '../../lib/posgres/schema';
import * as schema from '../../lib/posgres/schema';

export class UserRepository {
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public createUser = async (input: any) => {
    try {
      // const userEntity = this.db.getRepository(Users).create(user);
      const results = await this.db.insert(admin).values(input);
      return  await this.db.select().from(admin)
    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e
    }
  };

}
