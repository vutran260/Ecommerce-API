import { ChangePasswordInput } from '../types/Admin';
import {
  AuthFailureError,
  BadRequestError,
} from '../../lib/http/custom_error/ApiError';
import LoginRequest from '../requests/LoginRequest';
import { LP_ADMIN } from '../../lib/mysql/models/init-models';
import { Transaction } from 'sequelize';

export class AdminRepository {
  public getAdminByUserNamePassword = async (input: LoginRequest, t?: Transaction) => {
    const admin = await LP_ADMIN.findOne({
      where: {
        username: input.userName,
        password: input.password,
      },
      transaction: t
    });

    if (admin == null) {
      throw new AuthFailureError();
    }
    return admin.dataValues;
  };

  public updatePasswordAdmin = async (
    input: ChangePasswordInput,
    t?: Transaction,
  ) => {
    const rs = await LP_ADMIN.update(
      { password: input.password_new },
      {
        where: { id: input.id, password: input.password_confirm },
        transaction: t,
      },
    );

    if (rs[0] === 0) {
      throw new BadRequestError();
    }
  };
}
