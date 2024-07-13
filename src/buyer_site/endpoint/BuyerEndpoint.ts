import express, { Response } from 'express';
import Logger from '../../lib/core/Logger';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData } from '../../lib/http/Response';
import Buyer from '../../common/model/buyers/Buyer';
import { validatorRequest } from '../../lib/helpers/validate';
import { BuyerUsecase } from '../usecase/BuyerUsecase';
import { BuyerAuthenMiddlleware } from '../middleware/BuyerAuthenMiddleware';

export class BuyerEndpoint {
  private buyerUsecase: BuyerUsecase;

  constructor(buyerUsecase: BuyerUsecase) {
    this.buyerUsecase = buyerUsecase;
  }
  private getMe = async (req: ProtectedRequest, res: Response) => {
    const buyer = await this.buyerUsecase.getBuyerInfo(req.user.id)
    return ResponseData(buyer, res);
  };

  private registerBuyer = async (req: ProtectedRequest, res: Response) => {
    try {
      const registerBuyerRequest: Buyer = {
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        username: req.body.username,
        fullname: req.body.fullname,
      };

      await validatorRequest(registerBuyerRequest);

      const results = await this.buyerUsecase.registerBuyer(
        registerBuyerRequest,
      );

      return ResponseData({ token: results }, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private getCategoriesWithHierarchy = async (
    req: ProtectedRequest,
    res: Response,
  ) => {
    const id = req.query.id?.toString() || '';
    console.log('id', id);
    const response = await this.buyerUsecase.getCategoriesWithHierarchy(
      req.storeId!,
      id,
    );
    return ResponseData(response, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/register', this.registerBuyer);
    router.use(BuyerAuthenMiddlleware);
    router.get('/getMe', this.getMe);
    router.get('/categories/hierarchy', this.getCategoriesWithHierarchy);
    return router;
  }
}
