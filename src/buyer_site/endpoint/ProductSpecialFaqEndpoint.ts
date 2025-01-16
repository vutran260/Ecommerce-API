import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProductSpecialFaqUsecase } from '../usecase/ProductSpecialFaqUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';

export class ProductSpecialFaqEndpoint {
  private productSpecialFaqUseCase: ProductSpecialFaqUsecase;

  constructor(productSpecialUseCase: ProductSpecialFaqUsecase) {
    this.productSpecialFaqUseCase = productSpecialUseCase;
  }

  private submitFaq = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialFaqUseCase.submitFaq(
      req.user.id,
      req.storeId,
      req.body,
    );
    return ResponseData(results, res);
  };

  private detailFaq = async (req: ProtectedRequest, res: Response) => {
    const results = await this.productSpecialFaqUseCase.detailFaq({
      storeId: req.storeId,
      buyerId: req.user.id,
      productId: req.params.productId,
    });
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/', this.submitFaq);
    router.get('/:productId', this.detailFaq);
    return router;
  }
}
