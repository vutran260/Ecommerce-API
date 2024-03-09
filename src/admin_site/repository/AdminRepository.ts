import { ChangePasswordInput } from '../types/Admin';
import {
  AuthFailureError, BadRequestError,
} from '../../lib/http/custom_error/ApiError';
import LoginRequest from '../requests/LoginRequest';
import { LP_ADMIN } from '../../lib/mysql/models/init-models';

export class AdminRepository {

  public getAdminByUserNamePassword = async (input: LoginRequest) => {
    const admin = await LP_ADMIN.findOne({
      where: {
        username: input.userName,
        password: input.password,
      },
    });

    if (admin == null) {
      throw new AuthFailureError();
    }
    return admin.dataValues;
  };

  public updatePasswordAdmin = async (input: ChangePasswordInput) => {
    const rs = await LP_ADMIN.update(
      { password: input.password_new },
      { where: { id: input.id, password: input.password_confirm } },
    );
    
    if (rs[0]  === 0) {
      throw new BadRequestError();
    }
  };
}
