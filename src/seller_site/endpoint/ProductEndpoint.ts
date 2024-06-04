import express, { Request, Response } from 'express';
import { ProductUsecase } from '../usecase/ProductUsecase';
import Logger from '../../lib/core/Logger';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import { plainToClass } from "class-transformer";
import Product from '../../common/model/products/Product';

export class ProductEndpoint {
  private productUsecase: ProductUsecase;

  constructor(productUsecase: ProductUsecase) {
    this.productUsecase = productUsecase;
  }

  private createProduct = async (req: ProtectedRequest, res: Response) => {
      const productCreateRequest = plainToClass(Product, req.body);
      productCreateRequest.storeId = req.storeId;
      
      await validatorRequest(productCreateRequest);
      const results = await this.productUsecase.createProduct(
        productCreateRequest,
      );
      return ResponseData(results, res);
  };

  private updateProduct = async (req: ProtectedRequest, res: Response) => {
      const productCreateRequest = plainToClass(Product, req.body);
      await validatorRequest(productCreateRequest);
      const results = await this.productUsecase.updateProduct(
        productCreateRequest,
      );
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
      req.query["categoryId"] as string,
    );
    return ResponseListData(results, res, req.paging);
  };

  private deleteProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    await this.productUsecase.deleteProduct(id);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  }

  private deleteProducts = async (req: Request, res: Response) => {
    const ids: string[] = req.body.ids;
    await this.productUsecase.deleteProducts(ids);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  }

  private activeProduct = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    await this.productUsecase.activeProduct(id);
    return ResponseData({ message: 'Active is successfully!' }, res);
  }
  private inactiveProduct = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    await this.productUsecase.inactiveProduct(id);
    return ResponseData({ message: 'Inactive is successfully!' }, res);
  }
  public getRouter() {
    const router = express.Router();
    router.post('/create', this.createProduct);
    router.put('/', this.updateProduct);
    router.delete('/delete/:id', this.deleteProduct);
    router.delete('/products', this.deleteProducts);
    router.get('/detail/:id', this.getDetailProduct);
    router.get(
      '/products',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getProducts,
    );
    router.put('/active/:id', this.activeProduct);
    router.put('/inactive/:id', this.inactiveProduct);
    
    return router;
  }
}
