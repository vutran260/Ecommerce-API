import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import {
  BadRequestError,
  InternalError,
} from '../../lib/http/custom_error/ApiError';
import {
  Subscription,
  UpdateProductItemsRequest,
} from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT, ProductStatus } from '../../lib/constant/Constant';
import { SubscriptionOrderRepository } from '../repository/SubscriptionOrderRepository';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { LP_SUBSCRIPTION_PRODUCT } from '../../lib/mysql/models/LP_SUBSCRIPTION_PRODUCT';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_PRODUCT } from '../../lib/mysql/models/LP_PRODUCT';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';

export class SubscriptionUseCase {
  private subscriptionRepository: SubscriptionRepository;
  private subscriptionOrderRepository: SubscriptionOrderRepository;

  constructor(
    subscriptionRepository: SubscriptionRepository,
    subscriptionOrderRepository: SubscriptionOrderRepository,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionOrderRepository = subscriptionOrderRepository;
  }

  public getSubscriptions = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    return await this.subscriptionRepository.getSubscriptions(
      paging,
      order,
      filter,
    );
  };

  public getSubscription = async (id: string) => {
    return await this.subscriptionRepository.getSubscriptionById(id);
  };

  public getSubscriptionOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    subscriptionId: string,
  ) => {
    const subscriptionOrders =
      await this.subscriptionOrderRepository.getSubscriptionOrders(
        filter,
        order,
        paging,
        subscriptionId,
      );

    return subscriptionOrders?.map((item) => {
      return item.order;
    });
  };

  public updateSubscription = async (updateRequest: Subscription) => {
    const subscription = await this.subscriptionRepository.getSubscriptionById(
      updateRequest.id,
    );
    if (!subscription) {
      throw new BadRequestError('subscription not exist');
    }

    if (updateRequest.subscriptionPeriod) {
      subscription.subscriptionPeriod = updateRequest.subscriptionPeriod;
    }

    if (updateRequest.nextDate) {
      subscription.nextDate = moment(
        updateRequest.nextDate,
        DATE_FORMAT,
      ).toDate();
    }

    if (updateRequest.planDeliveryTimeFrom) {
      subscription.planDeliveryTimeFrom = updateRequest.planDeliveryTimeFrom;
    }

    if (updateRequest.planDeliveryTimeTo) {
      subscription.planDeliveryTimeTo = updateRequest.planDeliveryTimeTo;
    }

    if (updateRequest.subscriptionStatus) {
      subscription.subscriptionStatus = updateRequest.subscriptionStatus;
    }

    await this.subscriptionRepository.updateSubscription(subscription);
    return this.subscriptionRepository.getSubscriptionById(subscription.id);
  };

  public updateProductItems = async (
    subscriptionId: string,
    request: UpdateProductItemsRequest,
  ) => {
    const updateRequest = plainToInstance(UpdateProductItemsRequest, request);
    await validatorRequest(updateRequest);

    const t = await lpSequelize.transaction();
    const errors = [];

    try {
      const subscription =
        await this.subscriptionRepository.getSubscriptionById(subscriptionId);

      if (!subscription) {
        throw new InternalError('Subscription not found');
      }

      const existingProducts = await LP_SUBSCRIPTION_PRODUCT.findAll({
        where: { subscriptionId: subscriptionId },
        transaction: t,
      });

      const existingProductMap = Object.fromEntries(
        existingProducts.map((p) => [p.productId, p]),
      );

      for (const item of updateRequest.items) {
        const product = await LP_PRODUCT.findByPk(item.productId, {
          transaction: t,
        });

        if (!product) {
          errors.push({
            productId: item.productId,
            errorCode: ErrorCode.NOT_FOUND,
            message: `Product with ID ${item.productId} not found`,
          });
          continue;
        }

        if (product.status !== ProductStatus.ACTIVE) {
          errors.push({
            productId: item.productId,
            errorCode: ErrorCode.PRODUCT_INACTIVE,
            message: `Product with ID ${item.productId} is not active`,
          });
          continue;
        }

        if (product.stockItem === undefined) {
          continue;
        }

        const existingProduct = existingProductMap[item.productId];
        const quantityDifference = existingProduct
          ? item.quantity - existingProduct.quantity
          : item.quantity;

        if (quantityDifference > 0 && product.stockItem < quantityDifference) {
          errors.push({
            productId: item.productId,
            errorCode: ErrorCode.OVER_STOCK,
            message: `Product with ID ${item.productId} does not have enough stock. Available stock: ${product.stockItem}, requested quantity: ${quantityDifference}`,
          });
          continue;
        }

        if (existingProduct) {
          await existingProduct.update(
            { quantity: item.quantity },
            { transaction: t },
          );
          await product.update(
            { stockItem: product.stockItem - quantityDifference },
            { transaction: t },
          );
          delete existingProductMap[item.productId];
        } else {
          await LP_SUBSCRIPTION_PRODUCT.create(
            {
              subscriptionId: subscriptionId,
              productId: item.productId,
              quantity: item.quantity,
            },
            { transaction: t },
          );
          await product.update(
            { stockItem: product.stockItem - item.quantity },
            { transaction: t },
          );
        }
      }

      for (const productId in existingProductMap) {
        const product = await LP_PRODUCT.findByPk(productId, {
          transaction: t,
        });
        if (product && product.stockItem !== undefined) {
          await product.update(
            {
              stockItem:
                product.stockItem + existingProductMap[productId].quantity,
            },
            { transaction: t },
          );
          await existingProductMap[productId].destroy({ transaction: t });
        }
      }

      if (errors.length > 0) {
        await t.rollback();
        return { success: false, errors };
      }

      await t.commit();
      return {
        success: true,
        message: 'Subscription products updated successfully',
      };
    } catch (error) {
      await t.rollback();
      if (error instanceof Error) {
        throw new InternalError(
          `Error updating subscription products: ${error.message}`,
        );
      } else {
        throw new InternalError(
          `An unknown error occurred while updating subscription products.`,
        );
      }
    }
  };
}
