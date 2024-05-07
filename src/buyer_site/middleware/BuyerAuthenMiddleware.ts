import asyncHandler from '../../lib/helpers/asyncHandler';
import { getAccessToken } from '../../lib/auth/authUtils';
import {
  AccessTokenError,
  BadRequestError,
  BadTokenError,
  TokenExpiredError,
} from '../../lib/http/custom_error/ApiError';
import { ProtectedRequest } from '../../lib/http/app-request';
import { LP_BUYER, LP_BUYERAttributes } from '../../lib/mysql/models/LP_BUYER';
import { Header } from '../../lib/core/utils';
import validator from 'validator';
import {uniqueNamesGenerator, adjectives, colors, animals} from 'unique-names-generator'
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';

export const BuyerAuthenMiddlleware = asyncHandler(
  async (req: ProtectedRequest, res, next) => {
    const accessToken = getAccessToken(req.headers.authorization);
    const storeId = req.headers[Header.STORE_ID]?.toString();
    if (!storeId) {
      throw new BadRequestError('Missing store id');
    }

    const lpStore = await LP_STORE.findByPk(storeId);
    if (!lpStore) {
      throw new BadRequestError('Store not found');
    }

    try {
      const buyerInfo: LP_BUYERAttributes = validatetoken(
        accessToken,
      );
      let lpBuyer = await LP_BUYER.findByPk(buyerInfo.id);
      if (!lpBuyer) {
        lpBuyer = await LP_BUYER.create({
          id: buyerInfo.id
        });
      }

      if (!await lpBuyer.hasStoreIdLpStore(storeId)) {
        await lpBuyer.addStoreIdLpStore(storeId);
      } 

      
      req.user = lpBuyer?.dataValues;
      req.storeId = storeId;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  },
);

const validatetoken = (token: string): LP_BUYERAttributes => {
  if (!validator.isUUID(token)) {
    throw new BadTokenError('Invalid token');
  }

  return {
    id: token,
    username: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
  };
};
