import { PaginationRequest } from '../../lib/paging/Request';
import { ResponseListData } from '../..//lib/http/Response';
import { PrefectureUsecase } from '../usecase/PrefectureUsecase';
import express, { Response } from 'express';

export class PrefectureEndpoint {
  private prefectureUsecase: PrefectureUsecase;

  constructor(prefectureUsecase: PrefectureUsecase) {
    this.prefectureUsecase = prefectureUsecase;
  }

  private getPrefectures = async (req: PaginationRequest, res: Response) => {
    const results = await this.prefectureUsecase.getPrefectures();
    return ResponseListData(results, res, req.paging);
  };

  public getRouter() {
    const router = express.Router();

    router.get('/', this.getPrefectures);
    return router;
  }
}
