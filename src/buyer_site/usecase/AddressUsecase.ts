import { BadRequestError } from '../../lib/http/custom_error/ApiError';

import { Address } from '../endpoint/AddressEndpoint';
import { AddressRepository } from '../repository/AddressRepository';

export class AddressUsecase {
  private AddressRepo: AddressRepository;

  constructor(AddressRepo: AddressRepository) {
    this.AddressRepo = AddressRepo;
  }

  public addAddress = async (addAddressRequest: Address) => {
    if (!addAddressRequest.firstNameKana) {
      throw new BadRequestError('Missing first kana name');
    }
    if (!addAddressRequest.lastNameKana) {
      throw new BadRequestError('Missing last kana name');
    }
    if (!addAddressRequest.firstNameKanji) {
      throw new BadRequestError('Missing first kana kanji');
    }
    if (!addAddressRequest.lastNameKanji) {
      throw new BadRequestError('Missing last kana kanji');
    }
    if (!addAddressRequest.prefectureCode) {
      throw new BadRequestError('Missing prefecture code');
    }
    if (!addAddressRequest.postCode) {
      throw new BadRequestError('Missing post code');
    }
    if (!addAddressRequest.cityTown) {
      throw new BadRequestError('Missing city town');
    }
    if (!addAddressRequest.streetAddress) {
      throw new BadRequestError('Missing street address');
    }
    if (!addAddressRequest.buildingName) {
      throw new BadRequestError('Missing building name');
    }
    if (!addAddressRequest.email) {
      throw new BadRequestError('Missing email');
    }
    if (!addAddressRequest.telephoneNumber) {
      throw new BadRequestError('Missing telephone number');
    }

    await this.AddressRepo.addAddress(addAddressRequest);
  };

  public updateAddress = async (updateAddressRequest: Address) => {
    const address = await this.AddressRepo.getAddressById(
      updateAddressRequest.id,
    );
    if (!address) {
      throw new BadRequestError('address not exist');
    }

    await this.AddressRepo.updateAddress(updateAddressRequest);
    return this.AddressRepo.getAddressById(updateAddressRequest.id);
  };

  public deleteAddress = async (id: string) => {
    await this.AddressRepo.deleteAddress(id);
  };

  public getAddress = async (id: string) => {
    const item = await this.AddressRepo.getAddressById(id);
    return item;
  };

  public getAddressByBuyerId = async (id: string) => {
    const results = await this.AddressRepo.getAddressByBuyerId(id);
    return results;
  };

  public getAddressByStoreId = async (storeId: string) => {
    const results = await this.AddressRepo.getAddressByStoreId(storeId);
    return results;
  };
}
