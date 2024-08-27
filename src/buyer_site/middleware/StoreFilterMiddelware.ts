import asyncHandler from '../../lib/helpers/asyncHandler';
import { PaginationRequest } from '../../lib/paging/Request';
import { Header } from '../../lib/core/utils';

export const StoreFilterMiddelware = asyncHandler(
  async (req: PaginationRequest, res, next) => {
    try {
      const storeId = req.headers[Header.STORE_ID]?.toString();
      if (storeId) {
        req.filterList.push({
          attribute: 'store_id',
          value: storeId,
          operation: 'eq',
        });
      }
      return next();
    } catch (e) {
      throw e;
    }
  },
);
