import { Transaction } from 'sequelize';
import {
  LP_STORE,
  LP_STORECreationAttributes,
} from '../../lib/mysql/models/LP_STORE';
export class StoreRepository {
  public CreateStore = async (
    input: LP_STORECreationAttributes,
    t?: Transaction,
  ) => {
    await LP_STORE.create(input, { transaction: t });
    return this.getStoreByContactId(input.contractId, t);
  };

  public getStoreByContactId = async (contactId: string, t?: Transaction) => {
    const result = await LP_STORE.findOne({
      where: { contractId: contactId },
      transaction: t,
    });
    return result?.dataValues;
  };
}
