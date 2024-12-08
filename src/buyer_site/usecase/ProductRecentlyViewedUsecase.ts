import { ProductRecentlyViewedRepository } from '../repository/ProductRecentlyViewedRepository';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';

export class ProductRecentlyViewedUseCase {
  private productRecentlyViewedRepo: ProductRecentlyViewedRepository;

  constructor(productRecentlyViewedRepo: ProductRecentlyViewedRepository) {
    this.productRecentlyViewedRepo = productRecentlyViewedRepo;
  }

  // Add a product to the recently viewed list
  public addProductRecentlyViewed = async (
    buyerId: string,
    productId: string,
    storeId: string,
  ) => {
    if (!buyerId || !productId || !storeId) {
      throw new BadRequestError('Missing buyer or product ID or store ID');
    }

    // Clean old history older than 2 weeks
    await this.productRecentlyViewedRepo.cleanOldRecentlyViewed(buyerId);

    // Add or update the recently viewed product
    await this.productRecentlyViewedRepo.addOrUpdateRecentlyViewed(
      buyerId,
      productId,
      storeId,
    );

    // Enforce the 200 product limit
    await this.productRecentlyViewedRepo.limitRecentlyViewed(buyerId);
  };

  // Get recently viewed products for a buyer
  public getProductRecentlyViewed = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    buyerId: string,
    storeId: string,
  ) => {
    filter = filter || [];
    if (buyerId) {
      filter.push({
        operation: 'eq',
        value: buyerId,
        attribute: 'buyerId',
      });
    }
    if (storeId) {
      filter.push({
        operation: 'eq',
        value: storeId,
        attribute: 'storeId',
      });
    }

    order = order || [];
    order.push({
      attribute: 'viewedAt',
      direction: 'DESC',
    });

    return await this.productRecentlyViewedRepo.getProductRecentlyViewed(
      filter,
      order,
      paging,
    );
  };
}
