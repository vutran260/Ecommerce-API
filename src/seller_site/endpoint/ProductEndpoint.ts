import express, { Request, Response } from 'express';
import { ProductUsecase } from '../usecase/ProductUsecase';
import Logger from '../../lib/core/Logger';
import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';

export class ProductEndpoint {
  private productUsecase: ProductUsecase;

  constructor(productUsecase: ProductUsecase) {
    this.productUsecase = productUsecase;
  }

  private createProduct = async (req: ProtectedRequest, res: Response) => {
    try {
      const productCreateRequest = new ProductCreateRequest();
      productCreateRequest.productName = req.body.productName;
      productCreateRequest.productTag = req.body.productTag;
      productCreateRequest.productType = req.body.productType;
      productCreateRequest.stock = req.body.stock;
      productCreateRequest.price = req.body.price;
      productCreateRequest.status = req.body.status;
      productCreateRequest.storeId = req.storeId!;

      await validatorRequest(productCreateRequest);
      const results = await this.productUsecase.createProduct(productCreateRequest);
      return ResponseData(results, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private updateProduct = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    const productCreateRequest = new ProductCreateRequest();
    productCreateRequest.productName = req.body.productName;
    productCreateRequest.productTag = req.body.productTag;
    productCreateRequest.productType = req.body.productType;
    productCreateRequest.stock = req.body.stock;
    productCreateRequest.price = req.body.price;
    productCreateRequest.status = req.body.status;

    await validatorRequest(productCreateRequest);

    const results = await this.productUsecase.updateProduct(req.body, id);
    return ResponseData(results, res);
  };

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
    );
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/create', this.createProduct);
    router.put('/update/:id', this.updateProduct);
    // router.delete('/delete/:id', this.deleteProduct);
    router.get('/detail/:id', this.getDetailProduct);
    router.get('/products', PagingMiddelware, StoreFilterMiddelware, this.getProducts);
    return router;
  }
}
