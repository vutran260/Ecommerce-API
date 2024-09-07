import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { SubscriptionUseCase } from '../../seller_site/usecase/SubscriptionUsecase';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { StoreFilterMiddelware } from '../middleware/StoreFilterMiddelware';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { Subscription } from '../../common/model/orders/Subscription';

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
    router.get('/:id/orders', PagingMiddelware, this.getSubscriptionOrders);
    return router;
  }
}
