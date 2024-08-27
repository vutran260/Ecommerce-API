import { SellerRepository } from '../repository/SellerRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';

export class SellerUsecase {
  private sellerRepo: SellerRepository;

  constructor(sellerRepo: SellerRepository) {
    this.sellerRepo = sellerRepo;
  }

  public GetSeller = async (
    filter: Filter[],
    paging: Paging,
    order: LpOrder[],
  ) => {
    return this.sellerRepo.getSeller(filter, paging, order);
  };
}
