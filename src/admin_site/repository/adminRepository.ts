import Logger from '../../lib/core/Logger';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { admin, user } from '../../lib/posgres/schema';
import * as schema from '../../lib/posgres/schema';
import { and, eq } from 'drizzle-orm';
import { ChangePasswordInput, LoginInput } from '../types/admin';

export class AdminRepository {
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
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

  public checkExistsAdmin = async (username: string) => {
    try {
      const result = await this.db.select().from(admin).
      where(
        and(
        eq(admin.username, username),
        ));

        if (result.length < 1) {
          return 'Admin is not exits!';
        }
        return result
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error
    }
  }

  public updatePasswordAdmin= async (input: ChangePasswordInput) => {
    try {
      const result = await this.db.select().from(admin).
      where(
        and(
        eq(admin.username, input.username),
        ));
  
      if (result.length < 1) {
          return 'Admin is not exits!';
      }

      if (input.password_new !== input.password_confirm) {
        return 'Password confirm not match! Please input password confirm again';
      }

      await this.db.update(admin).set({
        password: input.password_confirm
      });
      return true;
      
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error
    }
  }

  public getUsers = async () => {
    try {
      const users = await this.db.select().from(user);
      if (users.length < 1) {
        return 'Data blank';
    }
    return users
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error
    }
  }

}
