import { UserRepository } from '../repository/userRepository';

export class UserUsecase {
  private userRepo: UserRepository;


  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  public createUser = async (user: any) => {
      return this.userRepo.createUser(user)
  };


}
