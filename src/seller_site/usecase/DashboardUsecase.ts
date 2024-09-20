import { DashboardRepository } from '../repository/DashboardRepository';

export class DashboardUseCase {
  private dashboardRepo: DashboardRepository;

  constructor(dashboardRepo: DashboardRepository) {
    this.dashboardRepo = dashboardRepo;
  }

  public getTodaySaleSummary = async (storeId: string) => {
    return await this.dashboardRepo.getTodaySaleSummary(storeId);
  };

  public getRecentOrders = async (storeId: string) => {
    return await this.dashboardRepo.getRecentOrders(storeId);
  };

  public getYearlySales = async (storeId: string, year: number) => {
    return await this.dashboardRepo.getYearlySales(storeId, year);
  };
}
