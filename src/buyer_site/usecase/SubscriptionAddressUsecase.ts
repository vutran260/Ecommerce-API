import { BadRequestError } from '../../lib/http/custom_error/ApiError';

import { SubscriptionAddressRepository } from '../repository/SubscriptionAddressRepository';
import { SubscriptionAddress } from '../../common/model/subscriptions/SubscriptionAddress';

export class SubscriptionAddressUseCase {
  private subscriptionAddressRepository: SubscriptionAddressRepository;

  constructor(subscriptionAddressRepository: SubscriptionAddressRepository) {
    this.subscriptionAddressRepository = subscriptionAddressRepository;
  }

  public updateAddress = async (updateAddressRequest: SubscriptionAddress) => {
    const address = await this.subscriptionAddressRepository.getAddressById(
      updateAddressRequest.id,
    );
    if (!address) {
      throw new BadRequestError('address not exist');
    }

    await this.subscriptionAddressRepository.updateSubscriptionAddress(
      updateAddressRequest,
    );
    return this.subscriptionAddressRepository.getAddressById(
      updateAddressRequest.id,
    );
  };

  public getAddress = async (id: string) => {
    return await this.subscriptionAddressRepository.getAddressById(id);
  };
}
