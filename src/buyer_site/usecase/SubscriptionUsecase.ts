import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { Subscription } from '../../common/model/orders/Subscription';
import moment from 'moment';
import { DATE_FORMAT } from '../../lib/constant/Constant';

export class SubscriptionUseCase {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
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
}
