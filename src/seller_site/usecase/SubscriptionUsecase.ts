import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
import {
  CreateProductSingleItemsRequest,
  Subscription,
  UpdateProductSingleItemsRequest,
} from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT, SubscriptionStatus } from '../../lib/constant/Constant';
import { SubscriptionOrderRepository } from '../repository/SubscriptionOrderRepository';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { lpSequelize } from '../../lib/mysql/Connection';
import Logger from '../../lib/core/Logger';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';

export class SubscriptionUseCase {
  private subscriptionRepository: SubscriptionRepository;
  private subscriptionOrderRepository: SubscriptionOrderRepository;
  private mailUseCase: MailUseCase;

  constructor(
    subscriptionRepository: SubscriptionRepository,
    subscriptionOrderRepository: SubscriptionOrderRepository,
    mailUseCase: MailUseCase,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.subscriptionOrderRepository = subscriptionOrderRepository;
    this.mailUseCase = mailUseCase;
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
    return await this.subscriptionRepository.updateSubscription({
      id: updateRequest.id,
      ...(updateRequest.nextDate && {
        nextDate: moment(updateRequest.nextDate, DATE_FORMAT).toDate(),
      }),
      ...(updateRequest.subscriptionStatus && {
        subscriptionStatus: updateRequest.subscriptionStatus,
      }),
      ...(updateRequest.subscriptionPeriod && {
        subscriptionPeriod: updateRequest.subscriptionPeriod,
      }),
      ...(updateRequest.planDeliveryTimeFrom && {
        planDeliveryTimeFrom: updateRequest.planDeliveryTimeFrom,
      }),
      ...(updateRequest.planDeliveryTimeTo && {
        planDeliveryTimeTo: updateRequest.planDeliveryTimeTo,
      }),
    });
  };

  public cancelSubscription = async (id: string, reasons: string[]) => {
    const subscription =
      await this.subscriptionRepository.getSubscriptionById(id);
    if (!subscription) {
      Logger.warn(`Subscription with ID ${id} not found.`);
      throw new NotFoundError(`Subscription with ID ${id} not found.`);
    }

    if (subscription.subscriptionStatus !== SubscriptionStatus.CONTINUE) {
      Logger.error(
        `Subscription ID ${id} cannot be canceled. Current status: ${subscription.subscriptionStatus}`,
      );
      throw new InternalError(`その定期便が解約されました。`);
    }

    const t = await lpSequelize.transaction();
    try {
      await this.subscriptionRepository.cancelSubscription(id, reasons, t);
      await this.mailUseCase.sendMailSellerCancelSubscription({
        subscription,
        reasons,
        canceledAt: new Date(),
      });
      Logger.info(`Cancellation email sent for order ID: ${id}`);
      await t.commit();
      return true;
    } catch (error) {
      Logger.error(`Failed to cancel subscription ID: ${id}`);
      Logger.error(error);
      await t.rollback();
      Logger.info(`Transaction rolled back for subscription ID: ${id}`);
      throw error;
    }
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
