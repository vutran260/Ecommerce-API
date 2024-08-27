import express, { Response } from 'express';
import { SellerUsecase } from '../usecase/SellerUsecase';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { ResponseListData } from '../../lib/http/Response';

export class SellerEndpoint {
  private sellerUsecase: SellerUsecase;

  constructor(sellerUsecase: SellerUsecase) {
    this.sellerUsecase = sellerUsecase;
  }

  private getSeller = async (req: PaginationRequest, res: Response) => {
    const results = await this.sellerUsecase.GetSeller(
      req.filterList,
      req.paging,
      req.order,
    );
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/sellers', PagingMiddelware, this.getSeller);
    return router;
  }
}
