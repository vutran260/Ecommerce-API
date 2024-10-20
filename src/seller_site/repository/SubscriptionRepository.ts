import { Transaction } from 'sequelize';

import {
  LP_BUYER,
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_PRODUCT,
  LP_SUBSCRIPTIONAttributes,
  LP_SUBSCRIPTION_ORDER,
  LP_ORDER,
  LP_PRODUCT,
  LP_SUBSCRIPTION_CANCEL_REASON,
} from '../../lib/mysql/models/init-models';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import lodash, { get, isEmpty } from 'lodash';
import {
  CreateProductSingleItemsRequest,
  UpdateProductSingleItemsRequest,
} from '../../common/model/orders/Subscription';
import { lpSequelize } from '../../lib/mysql/Connection';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import {
  OrderStatus,
  ProductStatus,
  SubscriptionStatus,
} from '../../lib/constant/Constant';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';
import Logger from '../../lib/core/Logger';

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

  public updateSubscription = async (
    request: Partial<LP_SUBSCRIPTIONAttributes>,
    t?: Transaction,
  ) => {
    await LP_SUBSCRIPTION.update(request, {
      where: {
        id: request.id,
      },
      ...(t && { transaction: t }),
    });
  };

  public cancelSubscription = async (
    id: string,
    reasons: string[],
    t?: Transaction,
  ) => {
    await this.updateSubscription(
      {
        id: id,
        subscriptionStatus: SubscriptionStatus.CANCELLED,
      },
      t,
    );

    await Promise.all(
      reasons.map(async (reason: string) => {
        Logger.info(
          `Saving cancel reason: ${reason} for subscription ID: ${id}`,
        );
        await LP_SUBSCRIPTION_CANCEL_REASON.create(
          {
            subscriptionId: id,
            cancelReason: reason,
          },
          {
            transaction: t,
          },
        );
      }),
    );
    Logger.info(`Cancel reasons saved for subscription ID: ${id}`);
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

  public updateProduct = async (
    subscriptionId: string,
    request: UpdateProductSingleItemsRequest,
    t: Transaction,
  ) => {
    const subscription = await this.getSubscriptionById(subscriptionId);

    if (!subscription) {
      throw new InternalError('Subscription not found');
    }

    // const latestOrder = get(
    //   subscription,
    //   'lpSubscriptionOrders[0].order',
    //   null,
    // );
    //
    // if (!latestOrder) {
    //   throw new InternalError(
    //     `No order found for subscription with ID ${subscriptionId}`,
    //   );
    // }
    //
    // if (
    //   latestOrder.orderStatus !== OrderStatus.WAITING_CONFIRMED &&
    //   latestOrder.orderStatus !== OrderStatus.CONFIRMED_ORDER
    // ) {
    //   throw new InternalError(
    //     `The subscription product cannot be edited because the latest order status does not allow editing.`,
    //   );
    // }

    const product = await LP_PRODUCT.findByPk(request.newProductId, {
      transaction: t,
    });

    if (!product) {
      return {
        success: false,
        error: {
          productId: request.newProductId,
          errorCode: ErrorCode.NOT_FOUND,
          errorField: 'productName',
          message: `Product with ID ${request.newProductId} not found`,
        },
      };
    }

    if (product.isDeleted) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.PRODUCT_DELETED,
          errorField: 'productName',
          message: `削除されている商品があります。`,
        },
      };
    }

    if (product.status !== ProductStatus.ACTIVE) {
      return {
        success: false,
        error: {
          productId: request.newProductId,
          errorCode: ErrorCode.PRODUCT_INACTIVE,
          errorField: 'productName',
          message: `Product with ID ${request.productId} is not active`,
        },
      };
    }

    if (product.stockItem === 0 || product.stockItem === undefined) {
      return {
        success: false,
        error: {
          productId: request.newProductId,
          errorCode: ErrorCode.OVER_STOCK,
          errorField: 'productName',
          message: `商品は在庫切れ、または売り切れのため変更できません。`,
        },
      };
    }

    if (product.stockItem < request.quantity) {
      return {
        success: false,
        error: {
          productId: request.newProductId,
          errorCode: ErrorCode.OVER_STOCK,
          errorField: 'quantity',
          message: `商品は在庫切れ、または売り切れのため変更できません。`,
        },
      };
    }

    // const existingSubProduct = await LP_SUBSCRIPTION_PRODUCT.findOne({
    //   where: { subscriptionId: subscriptionId, productId: request.productId },
    //   transaction: t,
    // });

    // await LP_PRODUCT.increment(
    //   { stockItem: existingSubProduct?.quantity },
    //   { where: { id: existingSubProduct?.productId }, transaction: t },
    // );
    //
    // await LP_PRODUCT.decrement(
    //   { stockItem: request.quantity },
    //   { where: { id: request.newProductId }, transaction: t },
    // );

    // Run raw SQL to update the productId and quantity
    await lpSequelize.query(
      `UPDATE LP_SUBSCRIPTION_PRODUCT 
           SET product_id = :newProductId, quantity = :quantity 
           WHERE subscription_id = :subscriptionId AND product_id = :oldProductId`,
      {
        replacements: {
          newProductId: request.newProductId,
          oldProductId: request.productId,
          quantity: request.quantity,
          subscriptionId: subscriptionId,
        },
        transaction: t,
      },
    );

    return {
      success: true,
      message: 'Subscription product updated successfully',
    };
  };

  public createProduct = async (
    subscriptionId: string,
    request: CreateProductSingleItemsRequest,
    t: Transaction,
  ) => {
    const subscription = await this.getSubscriptionById(subscriptionId);

    if (!subscription) {
      throw new InternalError('Subscription not found');
    }

    // const latestOrder = get(
    //   subscription,
    //   'lpSubscriptionOrders[0].order',
    //   null,
    // );
    //
    // if (!latestOrder) {
    //   throw new InternalError(
    //     `No order found for subscription with ID ${subscriptionId}`,
    //   );
    // }

    // if (
    //   latestOrder.orderStatus !== OrderStatus.WAITING_CONFIRMED &&
    //   latestOrder.orderStatus !== OrderStatus.CONFIRMED_ORDER
    // ) {
    //   throw new InternalError(
    //     `The subscription product cannot be edited because the latest order status does not allow editing.`,
    //   );
    // }

    const product = await LP_PRODUCT.findByPk(request.productId, {
      transaction: t,
    });

    if (!product) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.NOT_FOUND,
          errorField: 'productName',
          message: `Product with ID ${request.productId} not found`,
        },
      };
    }

    if (product.isDeleted) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.PRODUCT_DELETED,
          errorField: 'productName',
          message: `削除されている商品があります。`,
        },
      };
    }

    if (product.status !== ProductStatus.ACTIVE) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.PRODUCT_INACTIVE,
          errorField: 'productName',
          message: `無効化な商品があります。`,
        },
      };
    }

    if (product.stockItem === 0 || product.stockItem === undefined) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.OVER_STOCK,
          errorField: 'productName',
          message: `商品は在庫切れ、または売り切れのため変更できません。`,
        },
      };
    }

    if (product.stockItem < request.quantity) {
      return {
        success: false,
        error: {
          productId: request.productId,
          errorCode: ErrorCode.OVER_STOCK,
          errorField: 'quantity',
          message: `商品は在庫切れ、または売り切れのため変更できません。`,
        },
      };
    }

    // await LP_PRODUCT.decrement(
    //   { stockItem: request.quantity },
    //   { where: { id: request.productId }, transaction: t },
    // );

    await LP_SUBSCRIPTION_PRODUCT.create(
      {
        subscriptionId,
        productId: request.productId,
        quantity: request.quantity,
      },
      {
        transaction: t,
      },
    );

    return {
      success: true,
      message: 'Subscription product added successfully',
    };
  };

  public deleteProduct = async (
    subscriptionId: string,
    productId: string,
    t: Transaction,
  ) => {
    const subscription = await this.getSubscriptionById(subscriptionId);

    if (!subscription) {
      throw new InternalError('Subscription not found');
    }

    const latestOrder = get(
      subscription,
      'lpSubscriptionOrders[0].order',
      null,
    );

    if (!latestOrder) {
      throw new InternalError(
        `No order found for subscription with ID ${subscriptionId}`,
      );
    }

    if (
      latestOrder.orderStatus !== OrderStatus.WAITING_CONFIRMED &&
      latestOrder.orderStatus !== OrderStatus.CONFIRMED_ORDER
    ) {
      throw new InternalError(
        `The subscription product cannot be deleted because the latest order status does not allow editing.`,
      );
    }

    if (subscription.lpSubscriptionProducts.length === 1) {
      return {
        success: false,
        error: {
          productId: productId,
          errorCode: ErrorCode.BAD_REQUEST,
          errorField: 'productName',
          message: `この定期購読には最低1つの商品が必要です。削除することができません。`,
        },
      };
    }

    const existingSubProduct = await LP_SUBSCRIPTION_PRODUCT.findOne({
      where: { subscriptionId: subscriptionId, productId: productId },
      transaction: t,
    });

    // await LP_PRODUCT.increment(
    //   { stockItem: existingSubProduct?.quantity },
    //   { where: { id: existingSubProduct?.productId }, transaction: t },
    // );

    existingSubProduct?.destroy();

    return {
      success: true,
      message: 'Subscription product delete successfully',
    };
  };
}
