import express, { Request, Response } from 'express';
import { ProductUsecase } from '../usecase/ProductUsecase';
import Logger from '../../lib/core/Logger';
import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { pagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { DataType } from 'sequelize-typescript';

export class ProductEndpoint {
  private productUsecase: ProductUsecase;

  constructor(productUsecase: ProductUsecase) {
    this.productUsecase = productUsecase;
  }

  private createProduct = async (req: Request, res: Response) => {
    try {
      const productCreateRequest = new ProductCreateRequest();
      productCreateRequest.product_name = req.body.product_name;
      productCreateRequest.product_tag = req.body.product_tag;
      productCreateRequest.product_type = req.body.product_type;
      productCreateRequest.stock = req.body.stock;
      productCreateRequest.price = req.body.price;
      productCreateRequest.status = req.body.status;
      await validatorRequest(productCreateRequest);
      const results = await this.productUsecase.createProduct(req.body);
      return ResponseData(results, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private updateProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const productCreateRequest = new ProductCreateRequest();
    productCreateRequest.product_name = req.body.product_name;
    productCreateRequest.product_tag = req.body.product_tag;
    productCreateRequest.product_type = req.body.product_type;
    productCreateRequest.stock = req.body.stock;
    productCreateRequest.price = req.body.price;
    productCreateRequest.status = req.body.status;
    await validatorRequest(productCreateRequest);
    const results = await this.productUsecase.updateProduct(req.body, id);
    return ResponseData(results, res);
  };

  private deleteProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const results = await this.productUsecase.deleteProduct(id);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  };

  private detailProduct = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const results = await this.productUsecase.detailProduct(id);
    return ResponseData(results, res);
  };

  private getProducts = async (req: PaginationRequest, res: Response) => {
    const results = await this.productUsecase.getProducts(
      req.filterList,
      req.paging,
    );
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/create', this.createProduct);
    router.put('/update/:id', this.updateProduct);
    router.delete('/delete/:id', this.deleteProduct);
    router.get('/detail/:id', this.detailProduct);
    router.get('/products', pagingMiddelware, this.getProducts);
    return router;
  }
}
