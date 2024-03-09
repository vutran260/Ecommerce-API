import { StoreStatus } from '../../lib/constant/Store';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import { StoreRepository } from '../repository/StoreRepository';

export class StoreUsecase {

  private storeRepo: StoreRepository

  constructor(storeRepo: StoreRepository) {
    this.storeRepo = storeRepo;
  }

  public GetStoreList = async (filter: Filter[],order: LpOrder[], paging: Paging) => {
      return await this.storeRepo.getStoreList(filter, order, paging)
  };

  public GetStoreByID =async  (id: string) => {
    const rs =  await  this.storeRepo.getStoreById(id)
    if (!rs) {
      throw new NotFoundError()
    }
    return rs
}


  public ApproveCreateStoreRequest = async (storeId: string, remark: string) => {
    await this.storeRepo.updateStoreStatus(storeId, StoreStatus.ACTIVE, remark)
    return this.GetStoreByID(storeId)
  }

  public RejectCreateStoreRequest = async (storeId: string, remark: string) => {
    await this.storeRepo.updateStoreStatus(storeId, StoreStatus.REJECT, remark )
    return this.GetStoreByID(storeId)
  }


}
