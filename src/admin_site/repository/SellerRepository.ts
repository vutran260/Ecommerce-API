import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../lib/posgres/schema';
import { admin, seller } from '../../lib/posgres/schema';
import Logger from '../../lib/core/Logger';
import { Filter, getColumnFunc, getRepoFilter, Paging } from '../../lib/paging/Request';
import { PgColumn } from 'drizzle-orm/pg-core';

export class SellerRepository {
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getSeller = async (filter: Filter[], paging: Paging) => {
    try {
      const query = getRepoFilter(filter, this.getColumn)
      const results = await this.db.select().from(seller).where(query);
      return results
    } catch (e: any) {
      Logger.error(e);
      Logger.error(e.message);
      return e
    }
  };

  private getColumn : getColumnFunc = (colName: string): PgColumn=> {
    return this.columnMap.get(colName)!;
  }

  private columnMap = new Map<string, PgColumn>([
    ["id", seller.id],
    ["username", seller.username]
  ]);
}
