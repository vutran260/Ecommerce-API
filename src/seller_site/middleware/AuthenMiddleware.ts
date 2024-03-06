import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../lib/http/custom_error/ApiError';
import lodash from 'lodash';
import { ProtectedRequest } from '../../lib/http/app-request';
import { LP_USER } from '../../lib/mysql/models/LP_USER';

export const sellerAuthenMiddlleware = asyncHandler(async (req: ProtectedRequest, res, next) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  try {
    const payload = await JWT.validate(req.accessToken);

    const user = await LP_USER.findOne({
      where:{
        id: payload.sub
      }
    }) 

    if (!user || !user.dataValues) throw new AuthFailureError('Invalid token');
    lodash.unset(user.dataValues, 'password')
    req.user = user.dataValues;


    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
})
