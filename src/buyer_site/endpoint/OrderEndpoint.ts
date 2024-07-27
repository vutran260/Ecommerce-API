import { plainToClass } from 'class-transformer';
import express, { Response } from 'express';
import { CreateOrderRequest } from '../../../src/common/model/orders/Order';
import { validatorRequest } from '../../../src/lib/helpers/validate';
import { PagingMiddelware } from '../../../src/lib/paging/Middelware';
import { PaginationRequest } from '../../../src/lib/paging/Request';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { OrderUsecase } from '../usecase/OrderUsecase';

export class OrderEndpoint {
  private orderUsecase: OrderUsecase;

  constructor(orderUsecase: OrderUsecase) {
    this.orderUsecase = orderUsecase;
  }

  private createOrder = async (req: ProtectedRequest, res: Response) => {
    const orderCreateRequest = plainToClass(CreateOrderRequest, req.body);
    orderCreateRequest.storeId = req.storeId;

    await validatorRequest(orderCreateRequest);
    const results = await this.orderUsecase.createOrder(orderCreateRequest);
    return ResponseData(results, res);
  };

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

  // API testing check point on server SIFT
  private checkFraud = async (req: ProtectedRequest, res: Response) => {
    const results = await this.orderUsecase.checkFraud(
      req.body.type,
      req.body.userId,
    );
    return ResponseData(results, res);
  };

  // API testing create transaction for payment on GMO
  private entryTran = async (req: ProtectedRequest, res: Response) => {
    const transactionRequest = {
      orderID: req.body.orderID,
      jobCd: req.body.jobCd,
      amount: req.body.amount,
      tax: req.body.tax,
    };

    const results = await this.orderUsecase.entryTran(transactionRequest);
    return ResponseData(results, res);
  };

  // API testing excecute transaction for payment on GMO
  private execTran = async (req: ProtectedRequest, res: Response) => {
    const execTransactionRequest = {
      accessID: req.body.accessID,
      accessPass: req.body.accessPass,
      orderID: req.body.orderID,
      method: req.body.method,
      token: req.body.token,
    };

    const results = await this.orderUsecase.execTran(execTransactionRequest);
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/', PagingMiddelware, this.getOrders);
    router.get('/:id', this.getOrderDetail);
    router.post('/', this.createOrder);
    router.get(
      '/order-items/:id',
      PagingMiddelware,
      this.getOrderItemsByOrderId,
    );
    router.post('/test/fraud', this.checkFraud);
    router.post('/test/entry', this.entryTran);
    router.post('/test/exec', this.execTran);
    return router;
  }
}
