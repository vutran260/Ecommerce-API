import { plainToClass } from 'class-transformer';
import express, { Response } from 'express';
import { CreateOrderRequest } from '../../common/model/orders/Order';
import { validatorRequest } from '../../lib/helpers/validate';
import { PagingMiddelware } from '../../lib/paging/Middelware';
import { PaginationRequest } from '../../lib/paging/Request';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { OrderUsecase } from '../usecase/OrderUsecase';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { InvoiceUseCase } from '../usecase/InvoiceUsecase';

export class OrderEndpoint {
  private orderUsecase: OrderUsecase;
  private invoiceUseCase: InvoiceUseCase;

  constructor(orderUsecase: OrderUsecase, invoiceUseCase: InvoiceUseCase) {
    this.orderUsecase = orderUsecase;
    this.invoiceUseCase = invoiceUseCase;
  }

  private createOrder = async (req: ProtectedRequest, res: Response) => {
    const orderCreateRequest = plainToClass(CreateOrderRequest, req.body);
    const storeId: string = req.storeId;
    const buyerId: string = req.user.id;

    await validatorRequest(orderCreateRequest);
    const results = await this.orderUsecase.createOrder(
      req.body.cardSeq,
      buyerId,
      storeId,
    );
    return ResponseData(results, res);
  };

  private getOrderDetail = async (req: ProtectedRequest, res: Response) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid order id');
    }
    const result = await this.orderUsecase.getOrderById(Number(req.params.id));

    return ResponseData(result, res);
  };

  private cancelOrder = async (req: ProtectedRequest, res: Response) => {
    if (!req.params.id) {
      throw new BadRequestError('Invalid order id');
    }
    await this.orderUsecase.cancelOrder(Number(req.params.id));
    return ResponseData('cancel order success', res);
  };

  private getOrders = async (req: PaginationRequest, res: Response) => {
    const buyerId: string = req.user.id;
    const storeId: string = req.storeId;
    const result = await this.orderUsecase.getOrders(
      req.filterList,
      req.order,
      req.paging,
      buyerId,
      storeId,
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

  private issueInvoice = async (req: ProtectedRequest, res: Response) => {
    if (!req.body.email) {
      throw new BadRequestError('email is require');
    }
    if (!req.body.orderId) {
      throw new BadRequestError('orderId is require');
    }
    const result = await this.invoiceUseCase.issueInvoice({
      email: req.body.email,
      orderId: req.body.orderId,
    });
    return ResponseData(result, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/', PagingMiddelware, this.getOrders);
    router.get('/:id', this.getOrderDetail);
    router.delete('/:id/cancel', this.cancelOrder);
    router.post('/', this.createOrder);
    router.get(
      '/order-items/:id',
      PagingMiddelware,
      this.getOrderItemsByOrderId,
    );
    router.post('/issue-invoice', this.issueInvoice);
    return router;
  }
}
