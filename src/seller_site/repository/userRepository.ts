import { DataSource } from 'typeorm';
import { Users } from '../../entity/entities/Users';
import Logger from '../../core/Logger';

export class UserRepository {
  // private userRepo: userRepo
  private db: DataSource;


  constructor(db: DataSource) {
    this.db = db;
  }

  public createUser = async (user: Users) => {
    try {
      const userEntity = this.db.getRepository(Users).create(user);
      const results = await this.db.getRepository(Users).save(user);
      return results
    } catch (e: any) {
      Logger.error(e.message);
      return e
    }
  };

}
