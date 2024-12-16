import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { PointHistoryUseCase } from '../usecase/PointHistoryUsecase';
import { RequestPointStatus } from '../../lib/constant/point/RequestPointStatus';

export class PointHistoryEndpoint {
  private pointHistoryUseCase: PointHistoryUseCase;

  constructor(pointHistoryUseCase: PointHistoryUseCase) {
    this.pointHistoryUseCase = pointHistoryUseCase;
  }

  private usePoint = async (req: ProtectedRequest, res: Response) => {
    const result = await this.pointHistoryUseCase.usePoint({
      pointUse: req.body.pointUse,
      buyerId: req.user.id,
      storeId: req.storeId,
      requestStatus: RequestPointStatus.PENDING,
    });
    return ResponseData(result, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/use-point', this.usePoint);
    return router;
  }
}
