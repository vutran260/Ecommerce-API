import asyncHandler from '../../lib/helpers/asyncHandler';
import { Header } from '../../lib/core/utils';
import { ProtectedRequest } from '../../lib/http/app-request';

export const TimezoneMiddleware = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const timezone = req.headers[Header.TIMEZONE]?.toString();
    if (timezone) {
      req.timezone = timezone;
    }
    return next();
  },
);
