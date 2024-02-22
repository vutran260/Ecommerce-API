import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/SellerUsecase';
import { Filter, PaginationRequest } from '../../lib/paging/Request';
import { filter } from 'lodash';
import base64url from 'base64url';
import { pagingMiddelware } from '../../lib/paging/Middelware';
import { ResponseListData } from '../../lib/http/Response';

export class SellerEndpoint {
  private sellerUsecase: SellerUsecase;

  constructor(sellerUsecase: SellerUsecase) {
    this.sellerUsecase = sellerUsecase;
  }

  private getSeller = async (req: PaginationRequest, res: Response) => {
    const results = await this.sellerUsecase.GetSeller(req.filter, req.paging);
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/sellers', pagingMiddelware, this.getSeller);
    return router;
  }
}
