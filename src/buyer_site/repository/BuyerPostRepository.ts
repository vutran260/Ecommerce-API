import { LP_STORE_POST } from '../../lib/mysql/models/LP_STORE_POST';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';

export class BuyerPostRepository {
  public getPostById = async (id: string) => {
    const post = await LP_STORE_POST.findByPk(id);
    return post;
  };

  public getPosts = async (
    paging: Paging,
    order: LpOrder[],
    filter: Filter[],
  ) => {


    const count = await LP_STORE_POST.count({
      where: BuildQuery(filter),
    });

    const posts = await LP_STORE_POST.findAll({
      where: BuildQuery(filter),
      offset: GetOffset(paging),
      order: BuildOrderQuery(order),
      limit: paging.limit,
    });

    paging.total = count;

    return posts;
  };
}
