import { UserRepository } from './repository/userRepository';
import { AppDataSource } from '../data_source';
import { UserUsecase } from './usecase/userUsecase';
import { UserEndpoint } from './endpoint/userEndpoint';
import router from '../routes';
import express from 'express';
import { DataSource } from 'typeorm';


export class adminSiteRouter {
  private db : DataSource

  constructor(db: DataSource) {
    this.db = db;
  }

  public getAdminSiteRouter = () => {

    const router = express.Router();

    const userRepo = new UserRepository(this.db)
    const userUsecase = new UserUsecase(userRepo)
    const userRouter = new UserEndpoint(userUsecase)

    router.use('/user', userRouter.getRouter())

    return router
  }

}

