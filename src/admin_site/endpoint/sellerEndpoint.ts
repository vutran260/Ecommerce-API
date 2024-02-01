import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/sellerUsecase';

export class SellerEndpoint {

  private sellerUsecase : SellerUsecase

  constructor(userUsecase: SellerUsecase) {
    this.sellerUsecase = userUsecase;
  }

  private createUser = async (req: Request, res: Response) => {
    try {
      const results = await this.sellerUsecase.createUser(req.body)
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