import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { OrderUsecase } from '../usecase/OrderUsecase';
import Logger from '../../lib/core/Logger';
import { UpdateOrderStatusRequest } from '../../common/model/orders/Order';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';

export class OrderEndpoint {
  private orderUsecase: OrderUsecase;

  constructor(orderUsecase: OrderUsecase) {
    this.orderUsecase = orderUsecase;
  }

  private getOrderDetail = async (req: ProtectedRequest, res: Response) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid order id');
    }
    const result = await this.orderUsecase.getOrderById(Number(req.params.id));

    return ResponseData(result, res);
  };

  private getOrders = async (req: PaginationRequest, res: Response) => {
    const result = await this.orderUsecase.getOrders(
      req.filterList,
      req.order,
      req.paging,
    );

    return ResponseListData(result, res, req.paging);
  };

  private getOrderItemsByOrderId = async (
    req: PaginationRequest,
    res: Response,
  ) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid order id');
    }
    const result = await this.orderUsecase.getOrderItemsByOrderId(
      req.filterList,
      req.order,
      req.paging,
      Number(req.params.id),
    );

    return ResponseListData(result, res, req.paging);
  };

  private updateOrderStatus = async (req: ProtectedRequest, res: Response) => {
    try {
      const updateRequest: UpdateOrderStatusRequest = {
        orderId: req.body.orderId,
        status: req.body.status,
      };
      const results = await this.orderUsecase.updateOrderStatus(updateRequest);
      return ResponseData(results, res);
    } catch (error: any) {
      Logger.error(error.message);
      throw error;
    }
  };

  public getRouter() {
    const router = express.Router();
    router.get('/', PagingMiddelware, this.getOrders);
    router.get('/:id', this.getOrderDetail);
    router.get(
      '/order-items/:id',
      PagingMiddelware,
      this.getOrderItemsByOrderId,
    );
    router.post('/', this.updateOrderStatus);

    return router;
  }
}
