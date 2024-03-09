import express, { Request, Response } from 'express';
import { AdminUsecase } from '../usecase/AdminUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';
import { adminAuthenMiddlleware } from '../middleware/AuthenMiddlleware';
import { ResponseData } from '../../lib/http/Response';
import asyncHandler from '../../lib/helpers/asyncHandler';
import 'express-async-errors';
import LoginRequest from '../requests/LoginRequest';
import { validatorRequest } from '../../lib/helpers/validate';
export class AdminEndpoint {
  private adminUsecase: AdminUsecase;

  constructor(userUsecase: AdminUsecase) {
    this.adminUsecase = userUsecase;
  }

  private login = asyncHandler(async (req: Request, res: Response) => {
    const loginRequest: LoginRequest = {
      userName: req.body.userName,
      password: req.body.password,
    };
    await validatorRequest(loginRequest);
    const results = await this.adminUsecase.login(loginRequest);
    return ResponseData({ token: results }, res);
  });

  private getMe = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    return ResponseData(req.user, res);
  });

  private changePassword = asyncHandler(
    async (req: ProtectedRequest, res: Response) => {
      const results = await this.adminUsecase.changePassword({
        id: req.user.id,
        password_confirm: req.body.password_confirm,
        password_new: req.body.password_new,
      });
      const data = {
        res: {
          result: results,
          message: 'Update password successfully.',
        },
      };
      return ResponseData(data, res);
    },
  );

  public getRouter() {
    const router = express.Router();
    router.post('/login', this.login);
    router.use(adminAuthenMiddlleware);
    router.post('/change-password', this.changePassword);
    router.get('/me', this.getMe);
    return router;
  }
}
