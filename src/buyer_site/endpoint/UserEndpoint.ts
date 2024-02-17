import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { UserUsecase } from '../usecase/UserUsecase';

export class UserEndpoint {


  private userUsecase : UserUsecase

  constructor(userUsecase: UserUsecase) {
    this.userUsecase = userUsecase;
  }

  private createUser = async (req: Request, res: Response) => {
    try {
      const results = await this.userUsecase.createUser(req.body)
      return res.send(results);
    } catch (e: any) {
      Logger.error(e.message);
     throw e
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/', this.createUser);
    return router;
  }

}