import express, { Response } from 'express';
import { DashboardUseCase } from '../usecase/DashboardUsecase';
import { ResponseData, ResponseListData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { PaginationRequest } from '../../lib/paging/Request';
import { PagingMiddelware } from '../../lib/paging/Middelware';

export class DashboardEndpoint {
  private dashboardUseCase: DashboardUseCase;

  constructor(dashboardUseCase: DashboardUseCase) {
    this.dashboardUseCase = dashboardUseCase;
  }

  private getTodaySaleSummary = async (
    req: ProtectedRequest,
    res: Response,
  ) => {
    const storeId = req.storeId;
    const results = await this.dashboardUseCase.getTodaySaleSummary(storeId);
    return ResponseData(results, res);
  };

  private getRecentOrders = async (req: PaginationRequest, res: Response) => {
    const storeId = req.storeId;
    const results = await this.dashboardUseCase.getRecentOrders(
      storeId,
      req.filterList,
      req.order,
      req.paging,
    );
    return ResponseListData(results, res, req.paging);
  };

  private getYearlySales = async (req: ProtectedRequest, res: Response) => {
    const year = req.query.year;
    if (!year) {
      throw new BadRequestError('Year is required');
    }
    const yearNumber = Number(year);
    if (isNaN(yearNumber)) {
      throw new BadRequestError('Year must be a number');
    }

    const currentYear = new Date().getFullYear();
    if (yearNumber > currentYear) {
      throw new BadRequestError(
        `Year cannot be greater than the current year (${currentYear})`,
      );
    }
    const storeId = req.storeId;
    const results = await this.dashboardUseCase.getYearlySales(
      storeId,
      yearNumber,
    );
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.get('/today-sales-summary', this.getTodaySaleSummary);
    router.get('/recent-orders', PagingMiddelware, this.getRecentOrders);
    router.get('/yearly-sales', this.getYearlySales);
    return router;
  }
}
