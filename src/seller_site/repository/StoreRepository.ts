import { Transaction } from 'sequelize';
import {
  LP_STORE,
  LP_STORECreationAttributes,
} from '../../lib/mysql/models/LP_STORE';
import StoreUpdateRequest from '../../common/model/stores/StoreUpdateRequest';
import { WhereOptions } from 'sequelize/types/model';

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

  public getStoreById = async (id: string, t?: Transaction) => {
    const result = await LP_STORE.findOne({
      where: { id },
      include: [
        {
          association: LP_STORE.associations.lpStoreSso,
        },
      ],
      transaction: t,
    });

    return result?.dataValues;
  };

  public updateStore = async (
    input: StoreUpdateRequest,
    condition: WhereOptions,
    t?: Transaction,
  ) => {
    return LP_STORE.update(
      {
        ...input,
      },
      {
        where: condition,
        transaction: t,
      },
    );
  };
}
