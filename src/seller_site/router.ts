import { UserRepository } from './repository/userRepository';
import { UserUsecase } from './usecase/userUsecase';
import { UserEndpoint } from './endpoint/userEndpoint';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';


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

