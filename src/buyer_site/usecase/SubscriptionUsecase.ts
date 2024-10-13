import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import {
  BadRequestError,
  InternalError,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
import { Subscription } from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT, SubscriptionStatus } from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_SUBSCRIPTION_CANCEL_REASON } from '../../lib/mysql/models/LP_SUBSCRIPTION_CANCEL_REASON';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';

export class SubscriptionUseCase {
  private subscriptionRepository: SubscriptionRepository;
  private mailUseCase: MailUseCase;

  constructor(
    subscriptionRepository: SubscriptionRepository,
    mailUseCase: MailUseCase,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.mailUseCase = mailUseCase;
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

  public updateSubscription = async (updateRequest: Subscription) => {
    const subscription = await this.subscriptionRepository.getSubscriptionById(
      updateRequest.id,
    );
    if (!subscription) {
      throw new BadRequestError('subscription not exist');
    }

    subscription.subscriptionPeriod = updateRequest.subscriptionPeriod;
    subscription.nextDate = moment(
      updateRequest.nextDate,
      DATE_FORMAT,
    ).toDate();
    subscription.planDeliveryTimeFrom = updateRequest.planDeliveryTimeFrom;
    subscription.planDeliveryTimeTo = updateRequest.planDeliveryTimeTo;

    await this.subscriptionRepository.updateSubscription(subscription);
    return this.subscriptionRepository.getSubscriptionById(subscription.id);
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
      await this.subscriptionRepository.updateSubscriptionStatus({
        id,
        status: SubscriptionStatus.CANCELLED,
        t,
      });

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

      this.mailUseCase.sendMailBuyerCancelSubscription({
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
}
