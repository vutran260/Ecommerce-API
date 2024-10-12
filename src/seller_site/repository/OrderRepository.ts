import lodash, { forEach, isEmpty } from 'lodash';
import { Transaction } from 'sequelize';
import Logger from '../../lib/core/Logger';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { BuildQuery, Filter, GetOffset, Paging } from '../../lib/paging/Request';
import { LP_BUYER } from '../../lib/mysql/models/init-models';

export class OrderRepository {
  public getOrderById = async (id: number, t?: Transaction) => {
    return await LP_ORDER.findOne({
      where: { id },
      include: [
        {
          association: LP_ORDER.associations.buyer,
        },
        {
          association: LP_ORDER.associations.lpOrderPayment,
        },
        {
          association: LP_ORDER.associations.lpShipment,
        },
        {
          association: LP_ORDER.associations.lpOrderAddressBuyer,
        },
      ],
      transaction: t,
    });
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    try {
      if (isEmpty(order)) {
        order.push({
          attribute: 'createdAt',
          direction: 'DESC',
        });
      }
      paging.total = await LP_ORDER.count({
        where: BuildQuery(filter),
        distinct: true,
        col: 'id',
      });

      const results = await LP_ORDER.findAll({
        include: [
          {
            association: LP_ORDER.associations.buyer,
          },
          {
            association: LP_ORDER.associations.lpOrderPayment,
          },
        ],
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: this.customOrderQuery(order),
        limit: paging.limit,
      });
      forEach(results, (result) => {
        lodash.unset(result.dataValues, 'lpOrders');
      });
      return results;
    } catch (error: any) {
      Logger.error(error);
      Logger.error(error.message);
      throw error;
    }
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
