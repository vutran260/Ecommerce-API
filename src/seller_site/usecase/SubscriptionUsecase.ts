import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { Subscription } from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';
import { SubscriptionOrderRepository } from '../repository/SubscriptionOrderRepository';

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
}
