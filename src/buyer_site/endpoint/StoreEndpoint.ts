import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { StoreUsecase } from '../usecase/StoreUsecase';

export class StoreEndpoint {
  private storeUsecase: StoreUsecase;

  constructor(storeUsecase: StoreUsecase) {
    this.storeUsecase = storeUsecase;
  }

  private getStoreDetail = async (req: ProtectedRequest, res: Response) => {
    const id = req.params.id;
    const result = await this.storeUsecase.getStoreById(id);

    return ResponseData(result, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/detail/:id', this.getStoreDetail);
    return router;
  }
}
