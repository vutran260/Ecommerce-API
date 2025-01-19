import { plainToClass } from 'class-transformer';
import express, { Response } from 'express';
import { CreateOrderRequest } from '../../common/model/orders/Order';
import { validatorRequest } from '../../lib/helpers/validate';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { OrderSpecialUsecase } from '../usecase/OrderSpecialUsecase';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';

export class OrderSpecialEndpoint {
  private orderSpecialUsecase: OrderSpecialUsecase;

  constructor(orderSpecialUsecase: OrderSpecialUsecase) {
    this.orderSpecialUsecase = orderSpecialUsecase;
  }

  private createSpecialOrder = async (req: ProtectedRequest, res: Response) => {
    const orderCreateRequest = plainToClass(CreateOrderRequest, req.body);
    const storeId: string = req.storeId;
    const buyerId: string = req.user.id;

    await validatorRequest(orderCreateRequest);
    const results = await this.orderSpecialUsecase.createOrder(
      buyerId,
      storeId,
    );

    return ResponseData(results, res);
  };

  private confirmOrder = async (req: ProtectedRequest, res: Response) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid order id');
    }
    await this.orderSpecialUsecase.confirmOrder(Number(req.params.id));
    return ResponseData('confirm order success', res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/', this.createSpecialOrder);
    router.post('/:id/confirm', this.confirmOrder);
    return router;
  }
}
