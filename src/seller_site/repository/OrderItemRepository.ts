import lodash, { forEach } from 'lodash';
import { Transaction } from 'sequelize';
import Logger from '../../lib/core/Logger';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';

export class OrderItemRepository {
  public getListOrderItemByOrderId = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    orderId: number,
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
