import { SellerRepository } from '../repository/SellerRepository';
import { StoreRepository } from '../repository/StoreRepository';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { StoreStatus } from '../../lib/constant/Store';

export class StoreUsecase {
  private storeRepo: StoreRepository;
  private sellerRepo: SellerRepository


  constructor(storeRepository: StoreRepository, sellerRepo: SellerRepository) {
    this.storeRepo = storeRepository;
    this.sellerRepo = sellerRepo
  }


  public RegisterStore = async (seller: any, input: any) => {

    if (!!seller.id) throw new BadRequestError("seller already register store")

    const store = await this.storeRepo.CreateStore({
      storeKey: input.storeKey,
      storeName: input.storeName,
      status: StoreStatus.WAITING_FOR_CREATE_APPROVE
    })

    await this.sellerRepo.addStoreId(seller.id, store.id)

    return store
  };
}