import express, { Response } from 'express';

import { ProtectedRequest } from '../../lib/http/app-request';
import { ResponseData } from '../../lib/http/Response';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { SSOUseCase } from '../usecase/SSOUseCase';

export class SSOEndpoint {
  private ssoUseCase: SSOUseCase;

  constructor(ssoUseCase: SSOUseCase) {
    this.ssoUseCase = ssoUseCase;
  }

  private registerSSOUser = async (req: ProtectedRequest, res: Response) => {
    if (!req.body.accessToken) {
      throw new BadRequestError('accessToken is require');
    }
    if (!req.body.userAlias) {
      throw new BadRequestError('userAlias is require');
    }
    if (!req.body.storeAlias) {
      throw new BadRequestError('storeAlias is require');
    }
    const result = await this.ssoUseCase.registerSSOUser(
      req.body.accessToken,
      req.body.userAlias,
      req.body.storeAlias,
    );
    return ResponseData(result, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/register-user', this.registerSSOUser);
    return router;
  }
}
