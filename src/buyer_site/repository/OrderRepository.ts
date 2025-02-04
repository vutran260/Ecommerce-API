import { forEach, unset } from 'lodash';
import { Transaction } from 'sequelize';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '../../common/model/orders/Order';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import Logger from '../../lib/core/Logger';
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { LP_PRODUCT_SPECIAL_FAQ } from '../../lib/mysql/models/LP_PRODUCT_SPECIAL_FAQ';

export class OrderRepository {
  public createOrder = async (
    createOrderRequest: CreateOrderRequest,
    t?: Transaction,
  ) => {
    const order = await LP_ORDER.create(createOrderRequest, { transaction: t });
    return this.getOrderById(order.id, t);
  };

  public updateOrder = async (
    id: number,
    updateOrderRequest: UpdateOrderRequest,
    t?: Transaction,
  ) => {
    await LP_ORDER.update(updateOrderRequest, {
      where: {
        id,
      },
      transaction: t,
    });
    return this.getOrderById(id, t);
  };

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

  public getOrderFullAttrById = async (id: number, t?: Transaction) => {
    return await LP_ORDER.findOne({
      where: { id },
      include: [
        {
          association: LP_ORDER.associations.buyer,
        },
        {
          association: LP_ORDER.associations.lpShipment,
        },
        {
          association: LP_ORDER.associations.lpOrderAddressBuyer,
        },
        {
          association: LP_ORDER.associations.lpOrderItems,
          include: [
            {
              association: LP_ORDER_ITEM.associations.faq,
              include: [
                {
                  association: LP_PRODUCT_SPECIAL_FAQ.associations.product,
                },
              ],
            },
          ],
        },
        {
          association: LP_ORDER.associations.store,
          include: [
            {
              association: LP_STORE.associations.lpSellers,
            },
          ],
        },
      ],
      transaction: t,
    });
  };

  public getOrderWithItemsById = async (id: number, t?: Transaction) => {
    return await LP_ORDER.findOne({
      where: { id },
      include: [
        {
          association: LP_ORDER.associations.lpOrderItems,
        },
      ],
      transaction: t,
    });
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    buyerId: string,
    storeId: string,
  ) => {
    try {
      const isSubscription = filter.some(
        (f) => f.attribute === 'isSubscription' && f.value === 'true',
      );

      filter = filter.filter((f) => f.attribute !== 'isSubscription');

      filter.push({
        operation: 'eq',
        value: buyerId,
        attribute: 'buyerId',
      });

      filter.push({
        operation: 'eq',
        value: storeId,
        attribute: 'storeId',
      });

      const include: any[] = [
        {
          association: LP_ORDER.associations.buyer,
        },
        {
          association: LP_ORDER.associations.lpOrderPayment,
        },
        {
          association: LP_ORDER.associations.lpOrderItems,
          limit: 2,
        },
      ];

      if (isSubscription) {
        include.push({
          association: LP_ORDER.associations.lpSubscriptionOrders,
          required: true,
        });
      }

      const results = await LP_ORDER.findAll({
        include: include,
        where: BuildQuery(filter),
        offset: GetOffset(paging),
        order: BuildOrderQuery(order),
        limit: paging.limit,
      });
      forEach(results, (result) => {
        unset(result.dataValues, 'lpOrders');
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
