import { AdminRepository } from '../repository/AdminRepository';
import { createTokens } from '../../lib/auth/authUtils';
import crypto from 'crypto';
import { ChangePasswordInput } from '../types/Admin';
import LoginRequest from '../requests/LoginRequest';

export class AdminUsecase {
  private adminRepo: AdminRepository;

  constructor(userRepo: AdminRepository) {
    this.adminRepo = userRepo;
  }

  public login = async (input: LoginRequest) => {
    const result = await this.adminRepo.getAdminByUserNamePassword(input);
    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const token = await createTokens(
      result?.id || '',
      accessTokenKey,
      refreshTokenKey,
    );
    return token;
  };

  public changePassword = async (input: ChangePasswordInput) => {
    const result = await this.adminRepo.updatePasswordAdmin(input);
    return result;
  };
}
