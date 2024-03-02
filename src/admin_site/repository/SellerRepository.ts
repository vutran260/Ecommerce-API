import { Filter, GetOffset, Paging, BuildQuery } from '../../lib/paging/Request';
import { LP_SELLER } from '../../lib/mysql/models/init-models';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
export class SellerRepository {
  public getSeller = async (filter: Filter[], paging: Paging, order: LpOrder[]) => {
    const count = await LP_SELLER.count({ 
      where: BuildQuery(filter)
    });
    paging.total = count;
      
    const data = await LP_SELLER.findAll({
      where: BuildQuery(filter),
      offset: GetOffset(paging),
      limit: paging.limit,
      order: BuildOrderQuery(order)
    });
    return data
  };
}
