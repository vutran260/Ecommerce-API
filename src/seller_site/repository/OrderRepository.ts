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
import {
  LP_BUYER,
  LP_ORDER_ITEM,
  LP_PRODUCT,
} from '../../lib/mysql/models/init-models';
import { OrderStatus } from '../../lib/constant/Constant';

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

  public updateOrderStatus = async (
    input: UpdateOrderStatusRequest,
    t?: Transaction,
  ) => {
    // 1. Get the current status of the order before updating
    const currentOrder = await LP_ORDER.findOne({
      where: { id: input.orderId },
      attributes: ['orderStatus'],
      transaction: t,
    });

    if (!currentOrder) {
      throw new BadRequestError('Order not found');
    }

    // 2. Update new order status
    const orderUpdated = await LP_ORDER.update(
      { orderStatus: input.status },
      {
        where: { id: input.orderId },
        transaction: t,
      },
    );

    if (orderUpdated[0] === 0) {
      throw new BadRequestError();
    }

    // 3. If the current state is 'cancel' and the new state is different 'cancel'
    if (
      currentOrder.orderStatus === OrderStatus.CANCEL &&
      input.status !== OrderStatus.CANCEL
    ) {
      const orderItems = await LP_ORDER_ITEM.findAll({
        where: { orderId: input.orderId },
        attributes: ['productId', 'quantity'],
        transaction: t,
      });

      // Subtract product quantity from stock item when status changes from 'cancel' to another status
      for (const item of orderItems) {
        await LP_PRODUCT.decrement(
          { stockItem: item.quantity },
          { where: { id: item.productId }, transaction: t },
        );
      }
    }

    // 4. If the new status is 'cancel', add the quantity back to stock_item
    if (input.status === OrderStatus.CANCEL) {
      const orderItems = await LP_ORDER_ITEM.findAll({
        where: { orderId: input.orderId },
        attributes: ['productId', 'quantity'],
        transaction: t,
      });

      // Add the quantity back to stockItem for each product
      for (const item of orderItems) {
        await LP_PRODUCT.increment(
          { stockItem: item.quantity },
          { where: { id: item.productId }, transaction: t },
        );
      }
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
