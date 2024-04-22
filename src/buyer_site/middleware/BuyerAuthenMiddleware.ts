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
import { LP_USER } from '../../lib/mysql/models/LP_USER';
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

    const store = await LP_STORE.findByPk(storeId);
    if (!store) {
      throw new BadRequestError('Store not found');
    }

    try {
      const buyerInfo: LP_BUYERAttributes = validatetoken(
        accessToken,
        storeId,
      );

      let user = await LP_USER.findByPk(buyerInfo.id);
      if (!user) {
       user = await LP_USER.create({
          id: buyerInfo.id,
          contactId: '',
          prefectureId: '',
        });
      }

      
      let buyer = await LP_BUYER.findByPk(buyerInfo.id);
      if (!buyer) {
        buyerInfo.username = user.username;
        buyer = await LP_BUYER.create(buyerInfo);
      }

      req.user = buyer?.dataValues;
      req.storeId = storeId;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  },
);

const validatetoken = (token: string, storeId: string): LP_BUYERAttributes => {
  if (validator.isUUID(token)) {
    throw new BadTokenError('Invalid token');
  }

  return {
    id: token,
    storeId: storeId,
    username: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
  };
};
