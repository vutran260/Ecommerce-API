import Logger from '../../lib/core/Logger';
import { Admin, User, Seller } from '../../lib/mysql/schema';
import * as schema from '../../lib/mysql/schema';
import { and, eq } from 'drizzle-orm';
import { ChangePasswordInput } from '../types/Admin';
import {
  AuthFailureError,
  NoDataError,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
import LoginRequest from '../requests/LoginRequest';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { LP_ADMIN } from '../../lib/mysql/models/init-models';

export class AdminRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getAdminByUserNamePassword = async (input: LoginRequest) => {

    const admin = await LP_ADMIN.findOne({
      where: {
        username: input.userName,
        password: input.password,
      },
    });

    if (admin == null) {
      throw new AuthFailureError()
    }
    console.log("admin:",admin);
    return admin
  };

  public checkExistsAdmin = async (username: string) => {
    try {
      const result = await this.db
        .select()
        .from(Admin)
        .where(and(eq(Admin.username, username)));

      if (result.length < 1) {
        throw new NotFoundError('Admin is not exits!');
      }
      return result;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };

  public updatePasswordAdmin = async (input: ChangePasswordInput) => {
    try {
      const result = await this.db
        .select()
        .from(Admin)
        .where(and(eq(Admin.username, input.username)));
      if (result.length < 0) throw new NoDataError();

      if (input.password_new !== input.password_confirm) {
        return 'Password confirm not match! Please input password confirm again';
      }

      await this.db.update(Admin).set({
        password: input.password_confirm,
      });
      return true;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error;
    }
  };

  public getUsers = async () => {
    try {
      const users = await this.db.select().from(User);
      if (users.length == 0) throw new NoDataError();
      return users;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error;
    }
  };

  public getSellers = async () => {
    try {
      const sellers = await this.db.select().from(Seller);
      if (sellers.length == 0) throw new NoDataError();
      return sellers;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      return error;
    }
  };
}
