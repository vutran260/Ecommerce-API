import lodash, { forEach } from 'lodash';
import { Transaction } from 'sequelize';
import Logger from '../../lib/core/Logger';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { UpdateOrderStatusRequest } from '../../common/model/orders/Order';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';

export class OrderRepository {
  public getOrderById = async (id: number, t?: Transaction) => {
    const result = await LP_ORDER.findOne({
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
            association: LP_ORDER.associations.lpOrderPayment,
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

  public updateOrderStatus = async (
    input: UpdateOrderStatusRequest,
    t?: Transaction,
  ) => {
    const os = await LP_ORDER.update(
      { orderStatus: input.status },
      {
        where: { id: input.orderId },
        transaction: t,
      },
    );

    if (os[0] === 0) {
      throw new BadRequestError();
    }
  };
}
