import { Order, OrderItem } from '../../../src/common/model/orders/Order';
import { LP_ORDER } from '../../../src/lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../../src/lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../../src/lib/paging/Order';
import { Filter, Paging } from '../../../src/lib/paging/Request';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;

  constructor(orderRepo: OrderRepository, orderItemRepo: OrderItemRepository) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
  }

  public getOrderById = async (id: string) => {
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
    orderId: string,
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
}
