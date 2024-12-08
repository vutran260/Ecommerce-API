import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { ProductRecentlyViewedUseCase } from '../usecase/ProductRecentlyViewedUsecase';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';

export class ProductRecentlyViewedEndpoint {
  private productRecentlyViewedUseCase: ProductRecentlyViewedUseCase;

  constructor(productRecentlyViewedUseCase: ProductRecentlyViewedUseCase) {
    this.productRecentlyViewedUseCase = productRecentlyViewedUseCase;
  }

  private addProductRecentlyViewed = async (
    req: ProtectedRequest,
    res: Response,
  ) => {
    const { productId } = req.body;
    const buyerId = req.user.id;
    const storeId = req.storeId;

    await this.productRecentlyViewedUseCase.addProductRecentlyViewed(
      buyerId,
      productId,
      storeId,
    );
    return ResponseData('Product added to recently viewed!', res);
  };

  // Get recently viewed products for a buyer
  private getProductRecentlyViewed = async (
    req: PaginationRequest,
    res: Response,
  ) => {
    const buyerId = req.user.id;
    const storeId = req.storeId;
    const results =
      await this.productRecentlyViewedUseCase.getProductRecentlyViewed(
        req.filterList,
        req.order,
        req.paging,
        buyerId,
        storeId,
      );
    return ResponseListData(results, res, req.paging);
  };

  // Define routes
  public getRouter() {
    const router = express.Router();

    router.post('/', this.addProductRecentlyViewed);
    router.get('/', PagingMiddelware, this.getProductRecentlyViewed);
    return router;
  }
}
