import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../lib/http/custom_error/ApiError';
import { eq } from 'drizzle-orm';
import lodash from 'lodash';
import { ProtectedRequest } from '../../lib/http/app-request';
import { Admin } from '../../lib/mysql/schema';
import { dbConnection } from '../../lib/mysql/connection';

export const adminAuthenMiddlleware = asyncHandler(async (req: ProtectedRequest, res, next) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  try {
    const payload = await JWT.validate(req.accessToken);
    // validateTokenData(payload);

    const result = await dbConnection.select().from(Admin).where(eq(Admin.id, payload.sub));
    if (result.length == 0) throw new AuthFailureError('Invalid token');
    lodash.unset(result[0], 'password')
    req.user = result[0];


    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
})
