import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import Logger from '../../lib/core/Logger';

import { Address } from '../endpoint/AddressEndpoint';
import { LP_ADDRESS_BUYER } from '../../lib/mysql/models/LP_ADDRESS_BUYER';

export class AddressRepository {
  public addAddress = async (input: Address) => {
    await LP_ADDRESS_BUYER.create(input);
  };

  public updateAddress = async (input: Address) => {
    await LP_ADDRESS_BUYER.update(input, {
      where: {
        id: input.id,
      },
    });
  };

  public getAddressById = async (id: string) => {
    const product = await LP_ADDRESS_BUYER.findOne({
      where: {
        id: id,
      },
    });
    return product;
  };

  public getAddressByStoreId = async (storeId: string) => {
    const product = await LP_ADDRESS_BUYER.findAll({
      where: {
        storeId: storeId,
      },
    });
    return product;
  };

  public deleteAddress = async (id: string) => {
    const Address = await LP_ADDRESS_BUYER.findOne({
      where: {
        id: id,
      },
    });
    if (!Address) {
      Logger.error(`Failed to delete address ${id} not found`);
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    await LP_ADDRESS_BUYER.destroy({
      where: {
        id: id,
      },
    });
  };

  public getAddressByBuyerId = async (id: string, storeId: string) => {
    return await LP_ADDRESS_BUYER.findAll({
      where: {
        buyerId: id,
        storeId: storeId,
      },
    });
  };

  public getLatestAddressByBuyerId = async (id: string) => {
    const results = await LP_ADDRESS_BUYER.findAll({
      where: {
        buyerId: id,
      },
      order: [['created_at', 'DESC']],
      limit: 1,
    });

    return results.length > 0 ? results[0] : null;
  };
}
