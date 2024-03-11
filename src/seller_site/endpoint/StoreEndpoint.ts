import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import Logger from '../../lib/core/Logger';
import { StoreUsecase } from '../usecase/StoreUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';
import StoreCreateRequest from '../requests/stores/StoreCreateRequest';
import { validatorRequest } from '../../lib/helpers/validate';

export class StoreEndpoint {
  private storeUsecase: StoreUsecase;

  constructor(storeUsecase: StoreUsecase) {
    this.storeUsecase = storeUsecase;
  }

  private registerStore = async (req: ProtectedRequest, res: Response) => {
    try {
      const storeCreateRequest: StoreCreateRequest = {
        prefectureId: req.body.prefectureId,
        storeKey: req.body.storeKey,
        storeName: req.body.storeName,
        status: req.body.contactId,
      };
      await validatorRequest(storeCreateRequest);
      const results = await this.storeUsecase.RegisterStore(req.user, storeCreateRequest);
      return ResponseData(results, res);
    } catch (e: any) {
      Logger.error(e.message);
      throw e;
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/register', this.registerStore);

    return router;
  }
}
