import { UserRepository } from './repository/UserRepository';
import { UserUsecase } from './usecase/UserUsecase';
import { UserEndpoint } from './endpoint/UserEndpoint';
import express from 'express';
import {NextFunction} from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/index';


export class adminSiteRouter {
  private db : PostgresJsDatabase

  constructor(db: PostgresJsDatabase) {
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

