import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { AdminUsecase } from '../usecase/AdminUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';
import { adminAuthenMiddlleware } from '../middleware/AuthenMiddlleware';
import { ResponseData } from '../../lib/http/Response';
import asyncHandler from '../../lib/helpers/asyncHandler';
import 'express-async-errors'

export class AdminEndpoint {
  private adminUsecase: AdminUsecase;

  constructor(userUsecase: AdminUsecase) {
    this.adminUsecase = userUsecase;
  }

  private login = asyncHandler(async (req: Request, res: Response) => {
      const results = await this.adminUsecase.login(req.body);
      return ResponseData({ token: results }, res);
  })

  private getMe = asyncHandler(async (req: ProtectedRequest, res: Response) => {
        return ResponseData(req.user, res);
    },
  );

  private changePassword = asyncHandler(
    async (req: Request, res: Response) => {
        const results = await this.adminUsecase.changePassword(req.body);
        const data = {
          res: {
            result: results,
            message: 'Update password successfully.',
          },
        };
        return ResponseData(data, res);
    },
  );

  private getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminUsecase.getUsers();
      return res.send({
        data: users,
        status: 200,
      });
    } catch (error: any) {
      Logger.error(error.message);
      throw error
    }
  };

  private getSellers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminUsecase.getSellers();
      return res.send({
        data: users,
        status: 200,
      });
    } catch (error: any) {
      Logger.error(error.message);
      throw error
    }
  };

  public getRouter() {
    const router = express.Router();
    router.post('/login', this.login);
    router.use(adminAuthenMiddlleware);
    router.post('/change-password', this.changePassword);
    router.get('/me', this.getMe);
    router.get('/users', this.getUsers);
    router.get('/sellers', this.getSellers);
    return router;
  }
}
