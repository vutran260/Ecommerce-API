import asyncHandler from '../../lib/helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { getAccessToken, validateTokenData } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../lib/core/ApiError';
import { dbConnection } from '../../lib/posgres/connection';
import { admin } from '../../lib/posgres/schema';
import { eq } from 'drizzle-orm';
import lodash from 'lodash';

export const adminAuthenMiddlleware = asyncHandler(async (req: ProtectedRequest, res, next) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  try {
    const payload = await JWT.validate(req.accessToken);
    // validateTokenData(payload);

    const result = await dbConnection.select().from(admin).where(eq(admin.id, payload.sub));
    if (result.length == 0) throw new AuthFailureError('User not registered');
    lodash.unset(result[0], 'password')
    req.user = result[0];

    // const keystore = await KeystoreRepo.findforKey(req.user, payload.prm);
    // if (!keystore) throw new AuthFailureError('Invalid access token');
    // req.keystore = keystore;

    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
})
