import express, { Response } from 'express';
import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { OrderUsecase } from '../usecase/OrderUsecase';

export class OrderEndpoint {
  private orderUsecase: OrderUsecase;

  constructor(orderUsecase: OrderUsecase) {
    this.orderUsecase = orderUsecase;
  }

  private getOrderDetail = async (req: ProtectedRequest, res: Response) => {
    const id = req.params.id;
    const result = await this.orderUsecase.getOrderById(id);

    return ResponseData(result, res);
  };

  private getOrders = async (req: PaginationRequest, res: Response) => {
    const result = await this.orderUsecase.getOrders(
      req.filterList,
      req.order,
      req.paging,
      req.body.orderStatus,
    );

    return ResponseListData(result, res, req.paging);
  };

  private getOrderItemsByOrderId = async (
    req: PaginationRequest,
    res: Response,
  ) => {
    const result = await this.orderUsecase.getOrderItemsByOrderId(
      req.filterList,
      req.order,
      req.paging,
      req.params.id,
    );

    return ResponseListData(result, res, req.paging);
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

    return router;
  }
}
