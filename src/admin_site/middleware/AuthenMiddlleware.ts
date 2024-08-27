import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import {
  AccessTokenError,
  AuthFailureError,
  TokenExpiredError,
} from '../../lib/http/custom_error/ApiError';
import lodash from 'lodash';
import { ProtectedRequest } from '../../lib/http/app-request';
import { LP_ADMIN } from '../../lib/mysql/models/LP_ADMIN';

export const adminAuthenMiddlleware = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(req.accessToken);
      // validateTokenData(payload);

      const admin = await LP_ADMIN.findOne({
        where: {
          id: payload.sub,
        },
      });
      if (admin == null) {
        throw new AuthFailureError('Invalid token');
      }
      lodash.unset(admin, 'password');
      req.user = admin;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  },
);
