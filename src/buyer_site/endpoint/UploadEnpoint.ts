import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { UploadUsecase } from '../usecase/UploadUsecase';

export class UploadEndpoint {
  private uploadUsecase: UploadUsecase;

  constructor(uploadUsecase: UploadUsecase) {
    this.uploadUsecase = uploadUsecase;
  }

  // API testing upload file
  private uploadFile = async (req: ProtectedRequest, res: Response) => {
    const url = await this.uploadUsecase.uploadResource(req.body);
    return ResponseData(url, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/pre-signed-url', this.uploadFile);
    return router;
  }
}
