import { PaginationRequest } from '../../lib/paging/Request';
import express, { Response } from 'express';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { pagingMiddelware } from '../../lib/paging/Middelware';
import { StoreUsecase } from '../usecase/StoreUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';

export class StoreEndpoint {

  private storeUsecase : StoreUsecase

  constructor(storeUsecase: StoreUsecase) {
    this.storeUsecase = storeUsecase;
  }

  private getStores = async (req: PaginationRequest, res: Response) => {
    const results = await this.storeUsecase.GetStoreList(req.filterList, req.order, req.paging)
    return ResponseListData(results, res, req.paging)
  };

  private getStoreDetail = async (req: ProtectedRequest, res: Response) => {
    const Id = req.params.id;
    const results = await this.storeUsecase.GetStoreByID(Id)
    return ResponseData(results, res)
  };


  private rejectCreatingStoreRequest = async (req: ProtectedRequest, res: Response) => {
    const Id = req.params.id;
    const remark = req.body.remark;
    const results = await this.storeUsecase.RejectCreateStoreRequest(Id, remark)
    return ResponseData(results, res)
  };



  private approveCreatingStoreRequest = async (req: ProtectedRequest, res: Response) => {
    const Id = req.params.id;
    const remark = req.body.remark;
    const results = await this.storeUsecase.ApproveCreateStoreRequest(Id, remark)
    return ResponseData(results, res)
  };

  public getRouter() {
    const router = express.Router();
    router.get('/stores', pagingMiddelware,this.getStores);
    router.post(`/store/detail/:id`, this.getStoreDetail)
    return router;
  }

}
