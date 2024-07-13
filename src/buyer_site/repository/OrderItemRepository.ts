import { Transaction } from 'sequelize';
import { LP_ORDER_ITEM } from '../../../src/lib/mysql/models/LP_ORDER_ITEM';
import { CreateOrderItemRequest } from '../../common/model/orders/Order';

export class OrderItemRepository {
  public createOrderItem = async (
    orderCreateItemRequest: CreateOrderItemRequest,
    t?: Transaction,
  ) => {
    const orderItem = await LP_ORDER_ITEM.create(orderCreateItemRequest, {
      transaction: t,
    });
    return this.getOrderItemById(orderItem.id, t);
  };

  public getOrderItemById = async (id: string, t?: Transaction) => {
    const result = await LP_ORDER_ITEM.findOne({
      where: { id },
      transaction: t,
    });
    return result?.dataValues;
  };
}
