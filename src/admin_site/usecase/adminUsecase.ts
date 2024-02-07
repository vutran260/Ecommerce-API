import { AdminRepository } from '../repository/adminRepository';
import { createTokens } from '../../lib/auth/authUtils';
import crypto from 'crypto';
import { ChangePasswordInput, LoginInput } from '../types/admin';
import Logger from '../../lib/core/Logger';

export class AdminUsecase {
  private adminRepo: AdminRepository;


  constructor(userRepo: AdminRepository) {
    this.adminRepo = userRepo;
  }

  public login = async (input: LoginInput) => {
    try {
      const result=  await this.adminRepo.getAdminByUserNamePassword(input)
      const accessTokenKey = crypto.randomBytes(64).toString('hex');
      const refreshTokenKey = crypto.randomBytes(64).toString('hex');
      const token = await createTokens(result.id, accessTokenKey, refreshTokenKey);
      return token
    }catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      throw e
    }
  };


  public changePassword = async (input: ChangePasswordInput) => {
    const result = await this.adminRepo.updatePasswordAdmin(input);
    return result;
  }

  public getUsers = async () => {
    const users = await this.adminRepo.getUsers();
    return users;
  }
  
  public getSellers = async () => {
    const sellers = await this.adminRepo.getSellers();
    return sellers;
  }

}
