import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ProductSpecialQuestionUseCase } from '../usecase/ProductSpecialQuestionUsecase';

export class ProductSpecialQuestionEndpoint {
  private productSpecialQuestionUseCase: ProductSpecialQuestionUseCase;

  constructor(productSpecialQuestionUseCase: ProductSpecialQuestionUseCase) {
    this.productSpecialQuestionUseCase = productSpecialQuestionUseCase;
  }

  private getList = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialQuestionUseCase.getQuestionList();
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/', this.getList);
    return router;
  }
}
