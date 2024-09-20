import { LP_ORDER, LP_ORDER_ITEM } from '../../lib/mysql/models/init-models';
import { Op, Sequelize } from 'sequelize';

export class DashboardRepository {
  public async getTodaySaleSummary(storeId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const salesData = await LP_ORDER.findOne({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'todayTotalSales'], // Total sales amount (本日の売上)
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'todayTotalOrders'], // Total order count (本日の注文件数)
      ],
      where: {
        storeId: storeId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const purchasedItemsData = (await LP_ORDER_ITEM.findAll({
      raw: true,
      attributes: [
        [
          Sequelize.fn('SUM', Sequelize.col('quantity')),
          'todayTotalPurchasedItems',
        ], // Sum of quantities (本日の購買商品数)
      ],
      include: [
        {
          association: LP_ORDER_ITEM.associations.order,
          attributes: [],
          where: {
            storeId: storeId,
            createdAt: {
              [Op.between]: [startOfDay, endOfDay],
            },
          },
        },
      ],
    })) as unknown as { todayTotalPurchasedItems: number }[];

    return {
      todayTotalSales: salesData?.get('todayTotalSales') || 0,
      todayTotalOrders: salesData?.get('todayTotalOrders') || 0,
      todayTotalPurchasedItems:
        purchasedItemsData[0]?.todayTotalPurchasedItems || 0,
    };
  }

  public async getRecentOrders(storeId: string) {
    const currentTime = new Date();
    const past24Hours = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
    return await LP_ORDER.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      where: {
        storeId: storeId,
        createdAt: {
          [Op.between]: [past24Hours, currentTime],
        },
      },
    });
  }

  public async getYearlySales(storeId: string, year: number) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31 23:59:59`);

    const salesData = (await LP_ORDER.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSales'],
        [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
      ],
      where: {
        storeId: storeId,
        createdAt: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
      group: ['month'],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true,
    })) as unknown as { month: number; totalSales: number }[];

    const monthlySales = Array.from({ length: 12 }, (v, i) => ({
      month: i + 1, // Months 1 to 12
      totalSales: 0, // Default to 0 sales
    }));

    salesData.forEach((sale) => {
      const monthIndex = sale.month - 1;
      monthlySales[monthIndex].totalSales = sale.totalSales;
    });

    const previousYear = year - 1;
    const startOfPreviousYear = new Date(`${previousYear}-01-01`);
    const endOfPreviousYear = new Date(`${previousYear}-12-31 23:59:59`);

    const previousYearSalesResult = (await LP_ORDER.findOne({
      attributes: [
        [
          Sequelize.fn('SUM', Sequelize.col('total_amount')),
          'previousYearSales',
        ],
      ],
      where: {
        storeId: storeId,
        createdAt: {
          [Op.between]: [startOfPreviousYear, endOfPreviousYear],
        },
      },
      raw: true,
    })) as unknown as { previousYearSales: number };

    const currentYearSales = monthlySales.reduce(
      (total, sale) => total + Number(sale.totalSales),
      0,
    );
    const previousYearSales = previousYearSalesResult?.previousYearSales || 0;

    let percentageChange = 0;
    if (previousYearSales > 0) {
      percentageChange =
        ((currentYearSales - previousYearSales) / previousYearSales) * 100;
    } else {
      percentageChange = 100;
    }

    return {
      salesData: monthlySales,
      percentageChange,
    };
  }
}
