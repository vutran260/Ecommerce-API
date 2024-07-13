import lodash, { forEach } from 'lodash';
import Logger from '../../../src/lib/core/Logger';
import { BuildOrderQuery, LpOrder } from '../../../src/lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../../src/lib/paging/Request';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { Transaction, where } from 'sequelize';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
} from '../../../src/common/model/orders/Order';

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
        orderReceiverId: updateCreateRequest.orderReceiverId,
        orderShipmentId: updateCreateRequest.orderShipmentId,
        orderPaymentId: updateCreateRequest.orderPaymentId,
        orderStatus: updateCreateRequest.orderStatus,
        totalOrderItemFee: updateCreateRequest.totalOrderItemFee,
        shipmentFee: updateCreateRequest.shipmentFee,
        totalFee: updateCreateRequest.totalFee,
        orderPaymentDatetime: updateCreateRequest.orderPaymentDatetime,
        orderShipmentStartDatetime:
          updateCreateRequest.orderShipmentStartDatetime,
        orderShipmentEndDatetime: updateCreateRequest.orderShipmentEndDatetime,
        orderCancelDatetime: updateCreateRequest.orderCancelDatetime,
        orderUpdatedAt: new Date(),
        orderUpdatedBy: updateCreateRequest.orderUpdatedBy,
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
