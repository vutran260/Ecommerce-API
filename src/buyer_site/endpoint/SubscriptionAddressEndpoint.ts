import { plainToInstance } from 'class-transformer';
import express, { Response } from 'express';

import { validatorRequest } from '../../lib/helpers/validate';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData } from '../../lib/http/Response';
import { SubscriptionAddressUseCase } from '../usecase/SubscriptionAddressUsecase';
import { SubscriptionAddress } from '../../common/model/subscriptions/SubscriptionAddress';

export class SubscriptionAddressEndpoint {
  private subscriptionAddressUseCase: SubscriptionAddressUseCase;

  constructor(subscriptionAddressUseCase: SubscriptionAddressUseCase) {
    this.subscriptionAddressUseCase = subscriptionAddressUseCase;
  }

  private updateAddress = async (req: ProtectedRequest, res: Response) => {
    const updateAddressRequest = plainToInstance(SubscriptionAddress, req.body);
    updateAddressRequest.buyerId = req.user.id;
    // updateItemRequest.storeId = req.storeId;

    await validatorRequest(updateAddressRequest);
    await this.subscriptionAddressUseCase.updateAddress(updateAddressRequest);
    return ResponseData('update product success!!!', res);
  };

  private getAddress = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;

    const results = await this.subscriptionAddressUseCase.getAddress(id);
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/:id', this.getAddress);
    router.put('/', this.updateAddress);
    return router;
  }
}
