import {
  Filter,
  GetOffset,
  Paging,
  BuildQuery,
} from '../../lib/paging/Request';
import { LP_BUYER } from '../../lib/mysql/models/init-models';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
export class BuyerRepository {
  public async getBuyers(filter: Filter[], paging: Paging, order: LpOrder[]) {
    const count = await LP_BUYER.count({
      where: BuildQuery(filter),
    });
    paging.total = count;

    const data = await LP_BUYER.findAll({
      include: [
        {
          association: LP_BUYER.associations.lpAddressBuyerSso,
        },
        {
          association: LP_BUYER.associations.lpBuyerPersonalInformation,
        },
        {
          association: LP_BUYER.associations.lpOrders,
        },
      ],
      where: BuildQuery(filter),
      offset: GetOffset(paging),
      limit: paging.limit,
      order: BuildOrderQuery(order),
    });

    return { data, total: count };
  }

  public getBuyerById = async (id: string) => {
    const buyer = await LP_BUYER.findOne({
      include: [
        {
          association: LP_BUYER.associations.lpAddressBuyerSso,
        },
        {
          association: LP_BUYER.associations.lpBuyerPersonalInformation,
        },
      ],
      where: { id },
    });
    if (!buyer) {
      throw new NotFoundError('Buyer not found');
    }

    return buyer;
  };
}
