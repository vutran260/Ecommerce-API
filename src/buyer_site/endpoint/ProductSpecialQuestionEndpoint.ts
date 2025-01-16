import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProductSpecialUseCase } from '../usecase/ProductSpecialUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';

export class ProductSpecialQuestionEndpoint {
  private productSpecialUseCase: ProductSpecialUseCase;

  constructor(productSpecialUseCase: ProductSpecialUseCase) {
    this.productSpecialUseCase = productSpecialUseCase;
  }

  private getList = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialUseCase.getQuestionList();
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/', this.getList);
    return router;
  }
}
