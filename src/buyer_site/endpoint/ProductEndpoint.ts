import express, { Request, Response } from 'express';
import { ProductUsecase } from '../usecase/ProductUsecase';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';

export class ProductEndpoint {
  private productUsecase: ProductUsecase;

  constructor(productUsecase: ProductUsecase) {
    this.productUsecase = productUsecase;
  }

  private getDetailProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const results = await this.productUsecase.detailProduct(id);
    return ResponseData(results, res);
  };

  private getProducts = async (req: PaginationRequest, res: Response) => {
    const results = await this.productUsecase.getProducts(
      req.filterList,
      req.order,
      req.paging,
      req.query['categoryId'] as string,
    );
    return ResponseListData(results, res, req.paging);
  };

  private updateBuyerFavoriteProduct = async (req: PaginationRequest, res: Response) => {
    const buyerId = req.user.id;
    const productId: string = req.params.productId;
    await this.productUsecase.updateBuyerFavoriteProduct(productId, buyerId);
    return ResponseData({ message: 'Favorite status updated successfully!' }, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/detail/:id', this.getDetailProduct);
    router.get(
      '/products',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getProducts,
    );
    router.put('/favorite/:id', this.updateBuyerFavoriteProduct);

    return router;
  }
}
