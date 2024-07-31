import express, {  Response } from 'express';
import { BuyerUsecase } from '../usecase/BuyerUsecase';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { ResponseListData } from '../../lib/http/Response';

export class BuyerEndpoint {
  private buyerUsecase: BuyerUsecase;

  constructor(buyerUsecase: BuyerUsecase) {
    this.buyerUsecase = buyerUsecase;
  }

  private getBuyer = async (req: PaginationRequest, res: Response) => {
    const results = await this.buyerUsecase.GetBuyer(req.filterList, req.paging, req.order, req.search);
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/buyers', PagingMiddelware, this.getBuyer);
    return router;
  }
}