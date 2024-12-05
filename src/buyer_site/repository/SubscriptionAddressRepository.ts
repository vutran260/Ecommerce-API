import { SubscriptionAddress } from '../../common/model/subscriptions/SubscriptionAddress';
import { LP_SUBSCRIPTION_ADDRESS } from '../../lib/mysql/models/LP_SUBSCRIPTION_ADDRESS';

export class SubscriptionAddressRepository {
  public updateSubscriptionAddress = async (input: SubscriptionAddress) => {
    await LP_SUBSCRIPTION_ADDRESS.update(input, {
      where: {
        subscriptionId: input.id,
      },
    });
  };

  public getAddressById = async (id: string) => {
    return await LP_SUBSCRIPTION_ADDRESS.findOne({
      where: {
        subscriptionId: id,
      },
    });
  };
}
