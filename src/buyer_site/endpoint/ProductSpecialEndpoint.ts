import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProductSpecialUseCase } from '../usecase/ProductSpecialUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';

export class ProductSpecialEndpoint {
  private productSpecialUseCase: ProductSpecialUseCase;

  constructor(productSpecialUseCase: ProductSpecialUseCase) {
    this.productSpecialUseCase = productSpecialUseCase;
  }

  private getQuestionList = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialUseCase.getQuestionList();
    return ResponseData(results, res);
  };

  private submitFaq = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialUseCase.submitFaq(
      req.user.id,
      req.storeId,
      req.body,
    );
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/question-list', this.getQuestionList);
    router.post('/submit-faq', this.submitFaq);
    return router;
  }
}
