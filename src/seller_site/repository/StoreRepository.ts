import { LP_STORE, LP_STORECreationAttributes } from '../../lib/mysql/models/LP_STORE';

export class StoreRepository {

  public CreateStore = async (input: LP_STORECreationAttributes) => {

    await LP_STORE.create(input)
    return this.getStoreByContactId(input.contactId)
  }

  public getStoreByContactId = async (contactId: string) => {
    const result = await LP_STORE.findOne({ where: { contactId: contactId } });
    return result?.dataValues;
  };
}

