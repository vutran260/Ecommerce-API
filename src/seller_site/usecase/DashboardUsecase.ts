import { DashboardRepository } from '../repository/DashboardRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';

export class DashboardUseCase {
  private dashboardRepo: DashboardRepository;

  constructor(dashboardRepo: DashboardRepository) {
    this.dashboardRepo = dashboardRepo;
  }

  public getTodaySaleSummary = async (storeId: string) => {
    return await this.dashboardRepo.getTodaySaleSummary(storeId);
  };

  public getRecentOrders = async (
    storeId: string,
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    return await this.dashboardRepo.getRecentOrders(storeId, filter, order, paging);
  };

  public getYearlySales = async (storeId: string, year: number) => {
    return await this.dashboardRepo.getYearlySales(storeId, year);
  };
}
