import { UserRepository } from './repository/UserRepository';
import { UserUsecase } from './usecase/UserUsecase';
import { UserEndpoint } from './endpoint/UserEndpoint';
import express from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../lib/mysql/schema';

export class adminSiteRouter {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
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

