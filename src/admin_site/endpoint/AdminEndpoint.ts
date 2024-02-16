import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { AdminUsecase } from '../usecase/adminUsecase';
import { ProtectedRequest } from '../../lib/http/app-request';
import { adminAuthenMiddlleware } from '../middleware/authenMiddlleware';
import { ResponseData } from '../../lib/http/Response';

export class AdminEndpoint {
  private adminUsecase: AdminUsecase;

  constructor(userUsecase: AdminUsecase) {
    this.adminUsecase = userUsecase;
  }

  private login = async (req: Request, res: Response) => {
    try {
      const results = await this.adminUsecase.login(req.body);
      return ResponseData({ token: results }, res)
    } catch (e: any) {
      Logger.error(e.message);
      return res.send({error: e.message});
    }
  };

  private getMe = async (req: ProtectedRequest, res: Response) => {
    try {
      return ResponseData(req.user, res)
    } catch (e: any) {
      Logger.error(e.message);
      return res.send('error');
    }
  };

  private changePassword = async (req: Request, res: Response) => {
    try {
      const results = await this.adminUsecase.changePassword(req.body);
      const data = {
        res: {
          result: results,
          message: 'Update password successfully.',
        },
      }
      return ResponseData(data, res)
    } catch (e: any) {
      Logger.error(e.message);
      return res.send('error');
    }
  };

  private getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminUsecase.getUsers();
      return res.send({
        data: users,
        status: 200,
      });
    } catch (error: any) {
      Logger.error(error.message);
      return res.send('error');
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
      return res.send('error');
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
