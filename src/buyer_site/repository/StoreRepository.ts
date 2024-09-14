import { LP_STORE } from '../../lib/mysql/models/LP_STORE';

export class StoreRepository {
  public getStoreById = async (id: string) => {
    const result = await LP_STORE.findOne({
      where: { id },
      include: [
        {
          association: LP_STORE.associations.lpStoreSso,
        },
      ],
    });

    return result?.dataValues;
  };
}
