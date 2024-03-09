import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/SellerUsecase';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { SellerAuthenMiddlleware } from '../middleware/SellerAuthenMiddleware';

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
      throw e;
    }
  };

  private getToken = async (req: Request, res: Response) => {
    try {
      const token = await this.sellerUsecase.GetTokenBySellerContactId(req.body.contact_id)
      return ResponseData({token:token}, res)
    }catch (e:any) {
      Logger.error(e);
      Logger.error(e?.message);
      throw e;
    }
  }

  private getMe = async (req: ProtectedRequest, res: Response) => { 
      return ResponseData(req.user, res);
  }


  public getRouter() {
    const router = express.Router();
    router.post('/register', this.registerSeller);
    router.post('/getToken', this.getToken);
    router.use(SellerAuthenMiddlleware)
    router.get('/me', this.getMe);
    return router;
  }

}