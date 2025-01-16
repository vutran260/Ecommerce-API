import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProductSpecialUseCase } from '../usecase/ProductSpecialUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';

export class ProductSpecialFaqEndpoint {
  private productSpecialUseCase: ProductSpecialUseCase;

  constructor(productSpecialUseCase: ProductSpecialUseCase) {
    this.productSpecialUseCase = productSpecialUseCase;
  }

  private submitFaq = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialUseCase.submitFaq(
      req.user.id,
      req.storeId,
      req.body,
    );
    return ResponseData(results, res);
  };

  private detailFaq = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialUseCase.detailFaq(
      req.user.id,
      req.storeId,
      req.params.productId,
    );
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/', this.submitFaq);
    router.get('/:productId', this.detailFaq);
    return router;
  }
}
