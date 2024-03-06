import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/index';
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';

export class StoreRepository {

  public CreateStore = async (input: CreateStoreInput) => {
    const rs = await LP_STORE.create(input)
    return rs.dataValues
  }
}


export interface CreateStoreInput  {
  storeKey: string
  storeName: string
  status: string
}