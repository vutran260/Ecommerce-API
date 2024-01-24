import { DataSource } from 'typeorm';
import { Users } from '../../entity/entities/Users';
import Logger from '../../core/Logger';
import { UserRepository } from '../repository/userRepository';
import userRepo from '../../database/repository/UserRepo';

export class UserUsecase {
  // private userRepo: userRepo
  private userRepo: UserRepository;


  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  public createUser = async (user: Users) => {
      return this.userRepo.createUser(user)
  };


}
