import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData } from '../../lib/http/Response';

export class BuyerEndpoint {
  private getMe = async (req: ProtectedRequest, res: Response) => {
      Logger.info('buyer getMe: ' + req.user.id);
      const buyer = req.user;
      return ResponseData(buyer, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/getMe', this.getMe);
    return router;
  }

}