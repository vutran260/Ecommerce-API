import { LP_PRODUCT_RECENTLY_VIEWED } from '../../lib/mysql/models/LP_PRODUCT_RECENTLY_VIEWED';
import { Op } from 'sequelize';
import {
  BuildQuery,
  Filter,
  GetOffset,
  Paging,
} from '../../lib/paging/Request';
import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import Product, {
  ProductFromLP_PRODUCT,
} from '../../common/model/products/Product';

export class ProductRecentlyViewedRepository {
  public getProductRecentlyViewed = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    const include = [
      {
        association: LP_PRODUCT_RECENTLY_VIEWED.associations.product,
        where: { status: 'ACTIVE', isDeleted: 0 },
      },
    ];

    const count = await LP_PRODUCT_RECENTLY_VIEWED.count({
      where: BuildQuery(filter),
      include,
    });

    const result = await LP_PRODUCT_RECENTLY_VIEWED.findAll({
      where: BuildQuery(filter),
      include,
      offset: GetOffset(paging),
      order: BuildOrderQuery(order),
      limit: paging.limit,
    });

    paging.total = count;

    const recentlyList: {
      productId: string;
      buyerId: string;
      product: Product;
      viewedAt: Date;
    }[] = [];
    result.map((item) => {
      recentlyList.push({
        productId: item.productId,
        buyerId: item.buyerId,
        product: ProductFromLP_PRODUCT(item.product),
        viewedAt: item.viewedAt,
      });
    });

    return recentlyList;
  };

  public cleanOldRecentlyViewed = async (buyerId: string) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Delete all entries older than 2 weeks
    await LP_PRODUCT_RECENTLY_VIEWED.destroy({
      where: {
        buyerId,
        viewedAt: {
          [Op.lt]: twoWeeksAgo,
        },
      },
    });
  };

  public limitRecentlyViewed = async (buyerId: string) => {
    const recentlyViewed = await LP_PRODUCT_RECENTLY_VIEWED.findAll({
      where: { buyerId },
      order: [['viewedAt', 'DESC']],
      attributes: ['productId'],
      offset: 200,
    });

    if (recentlyViewed.length > 0) {
      const productIdsToDelete = recentlyViewed.map((view) => view.productId);
      await LP_PRODUCT_RECENTLY_VIEWED.destroy({
        where: {
          buyerId,
          productId: productIdsToDelete,
        },
      });
    }
  };

  public addOrUpdateRecentlyViewed = async (
    buyerId: string,
    productId: string,
  ) => {
    await LP_PRODUCT_RECENTLY_VIEWED.upsert({
      buyerId,
      productId,
      viewedAt: new Date(),
    });
  };
}
