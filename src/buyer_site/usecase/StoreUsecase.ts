import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { StoreRepository } from '../repository/StoreRepository';

export class StoreUsecase {
  private storeRepo: StoreRepository;

  constructor(storeRepo: StoreRepository) {
    this.storeRepo = storeRepo;
  }

  public getStoreById = async (id: string) => {
    const result = await this.storeRepo.getStoreById(id);
    if (!result) {
      throw new NotFoundError();
    }
    return result;
  };
}
