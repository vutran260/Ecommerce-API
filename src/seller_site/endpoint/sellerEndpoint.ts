import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/sellerUsecase';

export class SellerEndpoint {


  private sellerUsecase : SellerUsecase

  constructor(sellerUsecase: SellerUsecase) {
    this.sellerUsecase = sellerUsecase;
  }

  private registerSeller = async (req: Request, res: Response) => {
    try {
      const results = await this.sellerUsecase.RegisterSeller(req.body)
      return res.send({token: results});
    } catch (e: any) {
      Logger.error(e.message);
      return res.send(e)
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/register', this.registerSeller);
    return router;
  }

}