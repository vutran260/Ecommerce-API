import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { BuyerRepository } from '../repository/BuyerRepository';
import { BuyerDetailInfo, BuyerInfo } from '../../common/model/buyers/Buyer';

export class BuyerUsecase {
  private buyerRepo: BuyerRepository;

  constructor(buyerRepo: BuyerRepository) {
    this.buyerRepo = buyerRepo;
  }

  public getBuyers = async (
    filter: Filter[],
    paging: Paging,
    order: LpOrder[],
    storeId: string,
  ) => {
    const buyers = await this.buyerRepo.getBuyers(
      filter,
      paging,
      order,
      storeId,
    );

    return buyers.data.map((buyer) => {
      return new BuyerInfo(buyer);
    });
  };

  public getBuyerById = async (id: string) => {
    const rs = await this.buyerRepo.getBuyerById(id);
    if (!rs) {
      throw new NotFoundError('Buyer not found');
    }
    return new BuyerDetailInfo(rs);
  };
}
