import { Transaction } from 'sequelize';
import { LP_ORDER_ITEM } from '../../../src/lib/mysql/models/LP_ORDER_ITEM';
import { CreateOrderItemRequest } from '../../common/model/orders/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../../src/lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../../src/lib/paging/Order';
import lodash, { forEach } from 'lodash';
import Logger from '../../../src/lib/core/Logger';

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

  public getListOrderItemByOrderId = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    orderId: string,
    t?: Transaction,
  ) => {
    try {
      filter.push({
        operation: 'eq',
        value: orderId,
        attribute: 'orderId',
      });

      const count = await LP_ORDER_ITEM.count({
        where: BuildQuery(filter),
        transaction: t,
        distinct: true,
        col: 'id',
      });
      paging.total = count;

      const results = await LP_ORDER_ITEM.findAll({
        where: BuildQuery(filter),
        transaction: t,
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
      });
      forEach(results, (result) => {
        lodash.unset(result.dataValues, 'lpOrderItems');
      });
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };
}
