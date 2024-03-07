import { UserRepository } from './repository/UserRepository';
import { UserUsecase } from './usecase/UserUsecase';
import { UserEndpoint } from './endpoint/UserEndpoint';
import express from 'express';

export class adminSiteRouter {

  public getAdminSiteRouter = () => {

    const router = express.Router();

    const userRepo = new UserRepository()
    const userUsecase = new UserUsecase(userRepo)
    const userRouter = new UserEndpoint(userUsecase)

    router.use('/user', userRouter.getRouter())


    return router
  }

}

