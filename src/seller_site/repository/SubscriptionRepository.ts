import { Transaction } from 'sequelize';

import {
  LP_BUYER,
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_PRODUCT,
  LP_SUBSCRIPTIONAttributes,
  LP_SUBSCRIPTION_ORDER,
  LP_ORDER,
} from '../../lib/mysql/models/init-models';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import lodash, { isEmpty } from 'lodash';

export class SubscriptionRepository {
  public getSubscriptions = async (
    paging: Paging,
    order: LpOrder[],
    filter: Filter[],
  ) => {
    if (isEmpty(order)) {
      order.push({
        attribute: 'createdAt',
        direction: 'DESC',
      });
    }
    const count = await LP_SUBSCRIPTION.count({
      where: BuildQuery(filter),
    });

    const subscriptions = await LP_SUBSCRIPTION.findAll({
      where: BuildQuery(filter),
      include: [
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionProducts,
          include: [
            {
              association: LP_SUBSCRIPTION_PRODUCT.associations.product,
            },
          ],
        },
        {
          association: LP_SUBSCRIPTION.associations.buyer,
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionOrders,
        },
      ],
      offset: GetOffset(paging),
      order: this.customOrderQuery(order),
      limit: paging.limit,
    });

    paging.total = count;

    return subscriptions;
  };

  public getSubscriptionById = async (id: string, t?: Transaction) => {
    return await LP_SUBSCRIPTION.findOne({
      where: { id: id },
      include: [
        {
          association: LP_SUBSCRIPTION.associations.buyer,
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionAddress,
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionProducts,
          include: [
            {
              association: LP_SUBSCRIPTION_PRODUCT.associations.product,
            },
          ],
        },
        {
          association: LP_SUBSCRIPTION.associations.lpSubscriptionOrders,
          include: [
            {
              association: LP_SUBSCRIPTION_ORDER.associations.order,
            },
          ],
        },
      ],
      order: [
        [
          { model: LP_SUBSCRIPTION_ORDER, as: 'lpSubscriptionOrders' },
          { model: LP_ORDER, as: 'order' },
          'created_at',
          'DESC',
        ],
      ],
      transaction: t,
    });
  };

  public updateSubscription = async (request: LP_SUBSCRIPTIONAttributes) => {
    await LP_SUBSCRIPTION.update(request, {
      where: {
        id: request.id,
      },
    });
  };

  private customOrderQuery = (orders: LpOrder[]): any => {
    const orderQueries = BuildOrderQuery(orders);
    return lodash.map(orderQueries, (order) => {
      if (lodash.get(order, '[0]') === 'buyerFullName') {
        return [
          { model: LP_BUYER, as: 'buyer' },
          'fullname',
          lodash.get(order, '[1]'),
        ];
      }
      return order;
    });
  };
}
