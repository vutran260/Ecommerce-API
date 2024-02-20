import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { SellerUsecase } from '../usecase/SellerUsecase';
import { Filter, PaginationRequest } from '../../lib/paging/Request';
import { filter } from 'lodash';
import base64url from 'base64url';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { pagingMiddelware } from '../../lib/paging/Middelware';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import ProductCreateRequest from '../requests/products/ProductCreateRequest';
import { validatorRequest } from '../../lib/helpers/validate';

export class SellerEndpoint {
  private sellerUsecase: SellerUsecase;

  constructor(sellerUsecase: SellerUsecase) {
    this.sellerUsecase = sellerUsecase;
  }

  private getSeller = async (req: PaginationRequest, res: Response) => {
    const results = await this.sellerUsecase.GetSeller(req.filter, req.paging);
    return ResponseListData(results, res, req.paging);
  };

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
      const results = await this.sellerUsecase.createProduct(req.body);
      return ResponseData(results[0], res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  private updateProduct = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    const productCreateRequest = new ProductCreateRequest();
    productCreateRequest.product_name = req.body.product_name;
    productCreateRequest.product_tag = req.body.product_tag;
    productCreateRequest.product_type = req.body.product_type;
    productCreateRequest.stock = req.body.stock;
    productCreateRequest.price = req.body.price;
    productCreateRequest.status = req.body.status;
    await validatorRequest(productCreateRequest);
    const results = await this.sellerUsecase.updateProduct(req.body, id);
    return ResponseData(results[0], res);
  };

  private deleteProduct = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    const results = await this.sellerUsecase.deleteProduct(id);
    return ResponseData({ message: 'Deleted is successfully!' }, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/sellers', pagingMiddelware, this.getSeller);
    router.post('/create-product', this.createProduct);
    router.put('/update-product/:id', this.updateProduct);
    router.delete('/delete-product/:id', this.deleteProduct);
    return router;
  }
}
