import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/SellerUsecase';
import { ResponseData } from '../../lib/http/Response';

export class SellerEndpoint {


  private sellerUsecase : SellerUsecase

  constructor(sellerUsecase: SellerUsecase) {
    this.sellerUsecase = sellerUsecase;
  }

  private registerSeller = async (req: Request, res: Response) => {
    try {
      const results = await this.sellerUsecase.RegisterSeller(req.body)
      return ResponseData({token:results}, res)
    } catch (e: any) {
      Logger.error(e.message);
      return res.send(e)
    }
  };

  private getToken = async (req: Request, res: Response) => {
    try {
      const token = await this.sellerUsecase.GetTokenBySellerId(req.body.id)
      return ResponseData({token:token}, res)
    }catch (e:any) {
      Logger.error(e);
      Logger.error(e?.message);
      return res.send(e)
    }
  }

  public getRouter() {
    const router = express.Router();
    router.post('/register', this.registerSeller);
    router.post('/getToken', this.getToken);
    return router;
  }

}