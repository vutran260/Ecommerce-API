import { DataSource } from 'typeorm';
import express, { Request, Response } from 'express';
import Logger from '../../core/Logger';
import { Users } from '../../entity/entities/Users';
import { UserUsecase } from '../usecase/userUsecase';

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
      return res.send("error")
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/', this.createUser);
    return router;
  }

}