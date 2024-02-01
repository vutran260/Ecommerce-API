import { AdminRepository } from '../repository/adminRepository';
import logger from '../../lib/core/Logger';

export class AdminUsecase {
  private adminRepo: AdminRepository;


  constructor(userRepo: AdminRepository) {
    this.adminRepo = userRepo;
  }

  public login = async (input: LoginInput) => {
    logger.info("asdfasdf", input)
    const result=  await this.adminRepo.getAdminByUserNamePassword(input)
    logger.info("rqwer", result)
    return result
  };


  public changePassword = async (input: ChangePasswordInput) => {
    const result = await this.adminRepo.updatePasswordAdmin(input);
    return result;
  }

}
