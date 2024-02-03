import { AdminRepository } from '../repository/adminRepository';
import crypto from 'crypto';
import { createTokens } from '../../lib/auth/authUtils';
import { ChangePasswordInput, LoginInput } from '../types/admin';

export class AdminUsecase {
  private adminRepo: AdminRepository;


  constructor(userRepo: AdminRepository) {
    this.adminRepo = userRepo;
  }

  public login = async (input: LoginInput) => {
    const result=  await this.adminRepo.getAdminByUserNamePassword(input)
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const token = await createTokens(result.id, accessTokenKey, refreshTokenKey);
    return token
  };


  public changePassword = async (input: ChangePasswordInput) => {
    const result = await this.adminRepo.updatePasswordAdmin(input);
    return result;
  }

}
