import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { admin } from '../../lib/posgres/schema';
import { and, eq } from 'drizzle-orm';

export class AdminRepository {
  private db:  PostgresJsDatabase;


  constructor(db:  PostgresJsDatabase) {
    this.db = db;
  }

  public getAdminByUserNamePassword = async (input: LoginInput) => {
    try {
      const result = await this.db.select().from(admin).
      where(
        and(
        eq(admin.username, input.userName),
        eq(admin.password, input.password)))

      if (result.length < 1) {
        return null
      }
      return result[0]

    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e
    }
  };

}
