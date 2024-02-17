import { UserRepository } from '../repository/UserRepository';
import { SellerRepository } from '../repository/SellerRepository';
import { Filter, Paging } from '../../lib/paging/Request';

export class SellerUsecase {

  private sellerRepo: SellerRepository

  constructor(sellerRepo: SellerRepository) {
    this.sellerRepo = sellerRepo;
  }

  public GetSeller = async (filter: Filter[], paging: Paging) => {
      return this.sellerRepo.getSeller(filter, paging)
  };


}
