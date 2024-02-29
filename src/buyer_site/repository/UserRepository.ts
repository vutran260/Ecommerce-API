import Logger from '../../lib/core/Logger';
import { Buyer } from '../../lib/mysql/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schema from '../../lib/mysql/schema';
export class UserRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public createUser = async (input: any) => {
    try {
      const results = await this.db.insert(Buyer).values(input);
      return  await this.db.select().from(Buyer)
    } catch (e: any) {
      Logger.error(e.message);
      throw e
    }
  };

}
