import { Transaction } from 'sequelize';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import {
  LP_SELLER,
  LP_SELLERCreationAttributes,
} from '../../lib/mysql/models/LP_SELLER';

export class SellerRepository {
  public createSeller = async (
    input: LP_SELLERCreationAttributes,
    t?: Transaction,
  ) => {
    const lpSeller = await LP_SELLER.create(input, { transaction: t });
    return await this.getSellerById(lpSeller.id, t);
  };

  public getSellerById = async (id: string, t?: Transaction) => {
    const result = await LP_SELLER.findOne({
      where: { id: id },
      transaction: t,
    });
    return result?.dataValues;
  };

  public addStoreId = async (
    sellerId: string,
    storeId: string,
    t?: Transaction,
  ) => {
    const result = await LP_SELLER.update(
      { storeId: storeId },
      { where: { id: sellerId }, transaction: t },
    );
    if (result[0] === 0) {
      throw new InternalError('Fail to add store to seller');
    }
  };
}
