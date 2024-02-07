import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../lib/core/ApiError';
import { dbConnection } from '../../lib/posgres/connection';
import { admin } from '../../lib/posgres/schema';
import { eq } from 'drizzle-orm';
import lodash from 'lodash';
import { AdminProtectedRequest } from '../types/common';

export const adminAuthenMiddlleware = asyncHandler(async (req: AdminProtectedRequest, res, next) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  try {
    const payload = await JWT.validate(req.accessToken);
    // validateTokenData(payload);

    const result = await dbConnection.select().from(admin).where(eq(admin.id, payload.sub));
    if (result.length == 0) throw new AuthFailureError('User not registered');
    lodash.unset(result[0], 'password')
    req.admin = result[0];


    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
})
