import Logger from '../../lib/core/Logger';
import { Admin } from '../../lib/mysql/schema';
import * as schema from '../../lib/mysql/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';

export class UserRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public createUser = async (input: any) => {
    try {
      // const userEntity = this.db.getRepository(Users).create(user);
      const results = await this.db.insert(Admin).values(input);
      return  await this.db.select().from(Admin)
    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e
    }
  };

}
