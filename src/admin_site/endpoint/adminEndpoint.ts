import express, { Request, Response } from 'express';
import Logger from '../../lib/core/Logger';
import { AdminUsecase } from '../usecase/adminUsecase';
import { ProtectedRequest } from '../../lib/types/app-request';
import { adminAuthenMiddlleware } from '../middleware/authenMiddlleware';

export class AdminEndpoint {
  private adminUsecase: AdminUsecase;

  constructor(userUsecase: AdminUsecase) {
    this.adminUsecase = userUsecase;
  }

  private login = async (req: Request, res: Response) => {
    try {
      const results = await this.adminUsecase.login(req.body);
      return res.send({ token: results });
    } catch (e: any) {
      Logger.error(e.message);
      return res.send({error: e.message});
    }
  };

  private getMe = async (req: ProtectedRequest, res: Response) => {
    try {
      return res.send(req.user);
    } catch (e: any) {
      Logger.error(e.message);
      return res.send('error');
    }
  };

  private changePassword = async (req: Request, res: Response) => {
    try {
      const results = await this.adminUsecase.changePassword(req.body);
      return res.send({
        res: {
          result: results,
          message: 'Update password successfully.',
        },
      });
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
