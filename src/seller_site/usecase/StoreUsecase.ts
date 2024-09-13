import { SellerRepository } from '../repository/SellerRepository';
import { StoreRepository } from '../repository/StoreRepository';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { LP_STORECreationAttributes } from '../../lib/mysql/models/LP_STORE';
import { LP_SELLERAttributes } from '../../lib/mysql/models/LP_SELLER';

export class StoreUsecase {
  private storeRepo: StoreRepository;
  private sellerRepo: SellerRepository;

  constructor(storeRepository: StoreRepository, sellerRepo: SellerRepository) {
    this.storeRepo = storeRepository;
    this.sellerRepo = sellerRepo;
  }

  public RegisterStore = async (
    seller: LP_SELLERAttributes,
    input: LP_STORECreationAttributes,
  ) => {
    if (seller.storeId)
      throw new BadRequestError('Seller already register store!');

    const store = await this.storeRepo.CreateStore(input);

    await this.sellerRepo.addStoreId(seller.id, store!.id);

    return store;
  };

  public getStoreDetail = async (id: string) => {
    return this.storeRepo.getStoreById(id);
  };
}
