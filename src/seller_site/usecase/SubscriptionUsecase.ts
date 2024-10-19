import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import {
  BadRequestError,
  InternalError,
} from '../../lib/http/custom_error/ApiError';
import {
  CreateProductSingleItemsRequest,
  Subscription,
  UpdateProductSingleItemsRequest,
} from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';
import { SubscriptionOrderRepository } from '../repository/SubscriptionOrderRepository';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { lpSequelize } from '../../lib/mysql/Connection';

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
    const subscriptions = await this.subscriptionRepository.getSubscriptions(
      paging,
      order,
      filter,
    );

    return subscriptions.map((subscription) => {
      return {
        ...subscription.toJSON(),
        totalQuantity: subscription.lpSubscriptionProducts.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
        totalFreeStock: subscription.lpSubscriptionProducts.reduce(
          (sum, item) => sum + (item.product.stockItem || 0),
          0,
        ),
      };
    });
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

  public updateProduct = async (
    subscriptionId: string,
    request: UpdateProductSingleItemsRequest,
  ) => {
    const updateSingleRequest = plainToInstance(
      UpdateProductSingleItemsRequest,
      request,
    );
    await validatorRequest(updateSingleRequest);
    const t = await lpSequelize.transaction();
    try {
      const result = await this.subscriptionRepository.updateProduct(
        subscriptionId,
        updateSingleRequest,
        t,
      );
      if (result.success) {
        await t.commit();
      } else {
        await t.rollback();
      }

      return result;
    } catch (error) {
      await t.rollback();
      if (error instanceof Error) {
        throw new InternalError(
          `Error updating subscription product: ${error.message}`,
        );
      } else {
        throw new InternalError(
          `An unknown error occurred while updating subscription product.`,
        );
      }
    }
  };

  public createProduct = async (
    subscriptionId: string,
    request: CreateProductSingleItemsRequest,
  ) => {
    const createRequest = plainToInstance(
      CreateProductSingleItemsRequest,
      request,
    );
    await validatorRequest(createRequest);
    const t = await lpSequelize.transaction();
    try {
      const result = await this.subscriptionRepository.createProduct(
        subscriptionId,
        createRequest,
        t,
      );
      if (result.success) {
        await t.commit();
      } else {
        await t.rollback();
      }

      return result;
    } catch (error) {
      await t.rollback();
      if (error instanceof Error) {
        console.error(error);
        throw new InternalError(
          `Error adding subscription product: ${error.message}`,
        );
      } else {
        throw new InternalError(
          `An unknown error occurred while adding subscription product.`,
        );
      }
    }
  };

  public deleteProduct = async (subscriptionId: string, productId: string) => {
    const t = await lpSequelize.transaction();
    try {
      const result = await this.subscriptionRepository.deleteProduct(
        subscriptionId,
        productId,
        t,
      );
      if (result.success) {
        await t.commit();
      } else {
        await t.rollback();
      }

      return result;
    } catch (error) {
      await t.rollback();
      if (error instanceof Error) {
        throw new InternalError(
          `Error delete subscription product: ${error.message}`,
        );
      } else {
        throw new InternalError(
          `An unknown error occurred while delete subscription product.`,
        );
      }
    }
  };
}
