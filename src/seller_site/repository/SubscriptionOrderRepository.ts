import {
  LP_ORDER,
  LP_SUBSCRIPTION_ORDER,
} from '../../lib/mysql/models/init-models';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import Logger from '../../lib/core/Logger';

export class SubscriptionOrderRepository {
  public getSubscriptionOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    subscriptionId: string,
  ) => {
    try {
      filter.push({
        operation: 'eq',
        value: subscriptionId,
        attribute: 'subscriptionId',
      });

      const count = await LP_SUBSCRIPTION_ORDER.count({
        where: BuildQuery(filter),
        distinct: true,
        col: 'orderId',
      });
      paging.total = count;

      return await LP_SUBSCRIPTION_ORDER.findAll({
        include: [
          {
            association: LP_SUBSCRIPTION_ORDER.associations.order,
            include: [
              {
                association: LP_ORDER.associations.buyer,
              },
              {
                association: LP_ORDER.associations.lpOrderPayment,
              },
            ],
          },
        ],
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
      });
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
  };
}
