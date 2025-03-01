import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { SubscriptionUseCase } from '../../seller_site/usecase/SubscriptionUsecase';
import {
  ResponseData,
  ResponseDataError,
  ResponseListData,
} from '../../lib/http/Response';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { Subscription } from '../../common/model/orders/Subscription';
import { isEmpty } from 'lodash';
import { StatusCode } from '../../lib/http/custom_error/StatusCode';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';

export class SubscriptionEndpoint {
  private subscriptionUseCase: SubscriptionUseCase;

  constructor(subscriptionUseCase: SubscriptionUseCase) {
    this.subscriptionUseCase = subscriptionUseCase;
  }

  private getSubscriptions = async (req: PaginationRequest, res: Response) => {
    const posts = await this.subscriptionUseCase.getSubscriptions(
      req.filterList,
      req.order,
      req.paging,
    );
    return ResponseListData(posts, res, req.paging);
  };

  private getSubscription = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;
    const results = await this.subscriptionUseCase.getSubscription(id);
    return ResponseData(results, res);
  };

  private getSubscriptionOrders = async (
    req: PaginationRequest,
    res: Response,
  ) => {
    const id: string = req.params.id;
    const results = await this.subscriptionUseCase.getSubscriptionOrders(
      req.filterList,
      req.order,
      req.paging,
      id,
    );
    return ResponseListData(results, res, req.paging);
  };

  private updateSubscription = async (req: ProtectedRequest, res: Response) => {
    const updateRequest = plainToInstance(Subscription, req.body);
    updateRequest.buyerId = req.user.id;
    updateRequest.storeId = req.storeId;
    updateRequest.id = req.params.id;

    await validatorRequest(updateRequest);
    await this.subscriptionUseCase.updateSubscription(updateRequest);
    return ResponseData('update subscription success!!!', res);
  };

  private cancelSubscription = async (req: ProtectedRequest, res: Response) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid subscription id');
    }
    if (!req.body.reasons) {
      throw new BadRequestError('Reasons is require');
    }
    await this.subscriptionUseCase.cancelSubscription(
      req.params.id,
      req.body.reasons,
    );
    return ResponseData('cancel subscription success', res);
  };

  private updateProduct = async (req: ProtectedRequest, res: Response) => {
    const result = await this.subscriptionUseCase.updateProduct(
      req.params.id,
      req.body,
    );
    if (!isEmpty(result?.error)) {
      return ResponseDataError(result?.error, StatusCode.SUCCESS, res);
    }
    return ResponseData('update subscription product success', res);
  };

  private createProduct = async (req: ProtectedRequest, res: Response) => {
    const result = await this.subscriptionUseCase.createProduct(
      req.params.id,
      req.body,
    );
    if (!isEmpty(result?.error)) {
      return ResponseDataError(result?.error, StatusCode.SUCCESS, res);
    }
    return ResponseData('create subscription product success', res);
  };

  private deleteProduct = async (req: ProtectedRequest, res: Response) => {
    const result = await this.subscriptionUseCase.deleteProduct(
      req.params.id,
      req.params.productId,
    );
    if (!isEmpty(result?.error)) {
      return ResponseDataError(result?.error, StatusCode.SUCCESS, res);
    }
    return ResponseData('delete subscription product success', res);
  };

  public getRouter() {
    const router = express.Router();
    router.get(
      '/',
      PagingMiddelware,
      StoreFilterMiddelware,
      this.getSubscriptions,
    );
    router.get('/:id', this.getSubscription);
    router.put('/:id', this.updateSubscription);
    router.post('/:id/cancel', this.cancelSubscription);
    router.put('/:id/update-product', this.updateProduct);
    router.post('/:id/create-product', this.createProduct);
    router.delete('/:id/delete/:productId', this.deleteProduct);
    router.get('/:id/orders', PagingMiddelware, this.getSubscriptionOrders);
    return router;
  }
}
