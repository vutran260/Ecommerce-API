import asyncHandler from '../../lib/helpers/asyncHandler';
import { LP_SELLERAttributes } from '../../lib/mysql/models/LP_SELLER';
import { PaginationRequest } from '../../lib/paging/Request';

export const StoreFilterMiddelware = asyncHandler(
  async (req: PaginationRequest, res, next) => {
    try {
      const seller = req.user as LP_SELLERAttributes;
      if (!!seller && !!seller.storeId) {
        req.filterList.push({
          attribute: 'store_id',
          value: seller.storeId,
          operation: 'eq',
        });
      }
      return next();
    } catch (e) {
      throw e;
    }
  },
);
