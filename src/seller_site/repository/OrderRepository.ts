import lodash, { forEach } from 'lodash';
import { Transaction } from 'sequelize';
import Logger from '../../../src/lib/core/Logger';
import { BuildOrderQuery, LpOrder } from '../../../src/lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../../src/lib/paging/Request';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';

export class OrderRepository {
  public getOrderById = async (id: string, t?: Transaction) => {
    const result = await LP_ORDER.findOne({
      where: { id },
      include: [
        {
          association: LP_ORDER.associations.buyer,
          include: [
            {
              association: 'lpAddressBuyers',
              limit: 1,
              order: [['createdAt', 'DESC']],
            },
          ],
        },
        {
          association: LP_ORDER.associations.lpOrderItems,
          limit: 5,
        },
        {
          association: LP_ORDER.associations.lpOrderPayments,
        },
        {
          association: LP_ORDER.associations.lpShipments,
        },
      ],
      transaction: t,
    });

    return result?.dataValues;
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    try {
      const count = await LP_ORDER.count({
        where: BuildQuery(filter),
        distinct: true,
        col: 'id',
      });
      paging.total = count;

      const results = await LP_ORDER.findAll({
        include: [
          {
            association: LP_ORDER.associations.buyer,
          },
          {
            association: LP_ORDER.associations.lpOrderPayments,
          },
        ],
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
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
}
