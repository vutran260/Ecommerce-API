import asyncHandler from '../../lib/helpers/asyncHandler';
import { ProtectedRequest } from '../../lib/http/app-request';
import { AuthFailureError } from '../../lib/http/custom_error/ApiError';

export const StoreAuthenMiddlleware = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    if (!req.storeId) {
      throw new AuthFailureError('Please resigter store!!');
    }
    return next();
  },
);
