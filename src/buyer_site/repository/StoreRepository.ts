import { LP_STORE } from '../../lib/mysql/models/LP_STORE';

export class StoreRepository {
  public getStoreById = async (id: string) => {
    const result = await LP_STORE.findByPk(id);
    return result?.dataValues;
  };
}
