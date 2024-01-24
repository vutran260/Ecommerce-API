import { Users } from '../../entity/entities/Users';
import { UserRepository } from '../repository/userRepository';

export class UserUsecase {
  private userRepo: UserRepository;


  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  public createUser = async (user: Users) => {
      return this.userRepo.createUser(user)
  };


}
