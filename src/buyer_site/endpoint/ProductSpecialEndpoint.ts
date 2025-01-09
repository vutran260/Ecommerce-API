import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import { ProductSpecialUseCase } from '../usecase/ProductSpecialUsecase';

export class ProductSpecialEndpoint {
  private productSpecialUseCase: ProductSpecialUseCase;

  constructor(productSpecialUseCase: ProductSpecialUseCase) {
    this.productSpecialUseCase = productSpecialUseCase;
  }
  private getQuestionList = async (req: PaginationRequest, res: Response) => {
    const results = await this.productSpecialUseCase.getQuestionList();
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get(
      '/question-list',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getQuestionList,
    );
    return router;
  }
}
