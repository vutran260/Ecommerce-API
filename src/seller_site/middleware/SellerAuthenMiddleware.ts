import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import JWT from '../../lib/core/JWT';
import { AccessTokenError, AuthFailureError, TokenExpiredError } from '../../lib/http/custom_error/ApiError';
import { ProtectedRequest } from '../../lib/http/app-request';
import { LP_SELLER } from '../../lib/mysql/models/LP_SELLER';

export const SellerAuthenMiddlleware = asyncHandler(async (req: ProtectedRequest, res, next) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  try {
    const payload = await JWT.validate(req.accessToken);

    const seller = await LP_SELLER.findOne({
      where:{
        id: payload.sub
      }
    }) 

    if (!seller || !seller.dataValues) throw new AuthFailureError('Invalid token');
    
    req.user = seller.dataValues;
    req.storeId = seller.dataValues.storeId;


    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
})

