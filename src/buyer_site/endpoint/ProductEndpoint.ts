import express, { Request, Response } from 'express';
import { ProductUsecase } from '../usecase/ProductUsecase';
import Logger from '../../lib/core/Logger';
import Product from '../requests/products/Product';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import { plainToClass } from 'class-transformer';

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

  public getRouter() {
    const router = express.Router();
    router.get('/detail/:id', this.getDetailProduct);
    router.get(
      '/products',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getProducts,
    );

    return router;
  }
}
