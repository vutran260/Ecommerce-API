import * as schema from '../../lib/mysql/schema';
import { Seller } from '../../lib/mysql/schema';
import Logger from '../../lib/core/Logger';
import {
  Filter,
  getColumnFunc,
  getRepoFilter,
  Paging,
} from '../../lib/paging/Request';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MySqlColumn } from 'drizzle-orm/mysql-core';
export class SellerRepository {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getSeller = async (filter: Filter[], paging: Paging) => {
    try {
      const query = getRepoFilter(filter, this.getColumn);
      console.log('query', filter);
      const results = await this.db.select().from(Seller).where(query);
      return results;
    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e;
    }
  };

  private getColumn: getColumnFunc = (colName: string): MySqlColumn => {
    return this.columnMap.get(colName)!;
  };

  private columnMap = new Map<string, MySqlColumn>([
    ['id', Seller.id],
    ['username', Seller.username],
  ]);

}
