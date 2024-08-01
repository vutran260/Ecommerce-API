import express, {  Response } from 'express';
import { BuyerUsecase } from '../usecase/BuyerUsecase';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';

export class BuyerEndpoint {
  private buyerUsecase: BuyerUsecase;

  constructor(buyerUsecase: BuyerUsecase) {
    this.buyerUsecase = buyerUsecase;
  }

  private getBuyer = async (req: PaginationRequest, res: Response) => {
    const results = await this.buyerUsecase.getBuyer(req.filterList, req.paging, req.order);
    return ResponseListData(results, res, req.paging);
  };

  private getBuyerDetail = async (req: ProtectedRequest, res: Response) => {
    const id = req.params.id;
    const results = await this.buyerUsecase.getBuyerById(id)
    return ResponseData(results, res)
  };

  public getRouter() {
    const router = express.Router();
    router.get('/buyers', PagingMiddelware, this.getBuyer);
    router.post(`/detail/:id`, this.getBuyerDetail);
    return router;
  }
}