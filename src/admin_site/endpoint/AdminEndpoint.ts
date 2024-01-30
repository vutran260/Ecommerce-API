import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { AdminUsecase } from '../usecase/adminUsecase';

export class AdminEndpoint {


  private adminUsecase : AdminUsecase

  constructor(userUsecase: AdminUsecase) {
    this.adminUsecase = userUsecase;
  }

  private login = async (req: Request, res: Response) => {
    try {
      const results = await this.adminUsecase.login(req.body)
      return res.send({"token": results.id});
    } catch (e: any) {
      Logger.error(e.message);
      return res.send("error")
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/login', this.login);
    return router;
  }

}