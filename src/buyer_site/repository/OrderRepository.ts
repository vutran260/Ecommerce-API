import lodash, { forEach } from 'lodash';
import { Transaction } from 'sequelize';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '../../../src/common/model/orders/Order';
import Logger from '../../../src/lib/core/Logger';
import { BadRequestError } from '../../../src/lib/http/custom_error/ApiError';
import { BuildOrderQuery, LpOrder } from '../../../src/lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../../src/lib/paging/Request';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';

export class OrderRepository {
  public createOrder = async (
    orderCreateRequest: CreateOrderRequest,
    t?: Transaction,
  ) => {
    const order = await LP_ORDER.create(orderCreateRequest, { transaction: t });
    return this.getOrderById(order.id, t);
  };

  public updateOrder = async (
    id: string,
    updateCreateRequest: UpdateOrderRequest,
    t?: Transaction,
  ) => {
    await LP_ORDER.update(
      {
        orderStatus: updateCreateRequest.orderStatus,
        amount: updateCreateRequest.amount,
        shipmentFee: updateCreateRequest.shipmentFee,
        discount: updateCreateRequest.discount,
        totalAmount: updateCreateRequest.totalAmount,
        updatedAt: new Date(),
        updatedBy: '',
      },
      {
        where: {
          id,
        },
        transaction: t,
      },
    );
    return this.getOrderById(id, t);
  };

  public getOrderById = async (id: string, t?: Transaction) => {
    const result = await LP_ORDER.findOne({
      where: { id },
      include: [
        {
          association: LP_ORDER.associations.buyer,
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
