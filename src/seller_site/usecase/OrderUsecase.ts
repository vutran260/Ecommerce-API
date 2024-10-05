import {
  Order,
  OrderItem,
  UpdateOrderStatusRequest,
} from '../../common/model/orders/Order';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;

  constructor(orderRepo: OrderRepository, orderItemRepo: OrderItemRepository) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
  }

  public getOrderById = async (id: number) => {
    const result = await this.orderRepo.getOrderById(id);
    return result;
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    let orders: LP_ORDER[] = [];
    orders = await this.orderRepo.getOrders(filter, order, paging);
    return orders.map((order) => {
      return new Order(order);
    });
  };

  public getOrderItemsByOrderId = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    orderId: number,
  ) => {
    let orders: LP_ORDER_ITEM[] = [];
    orders = await this.orderItemRepo.getListOrderItemByOrderId(
      filter,
      order,
      paging,
      orderId,
    );
    return orders.map((order) => {
      return new OrderItem(order);
    });
  };

  public updateOrderStatus = async (request: UpdateOrderStatusRequest) => {
    const order = await this.orderRepo.getOrderById(request.orderId);

    if (!order) {
      throw new NotFoundError(`Order with ID ${request.orderId} not found.`);
    }

    request.currentStatus = order.orderStatus || '';

    const updateRequest = plainToInstance(UpdateOrderStatusRequest, request);
    await validatorRequest(updateRequest);
    await this.orderRepo.updateOrderStatus(request);
  };
}
