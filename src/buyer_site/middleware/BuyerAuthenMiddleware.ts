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
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';
import { LP_ADDRESS_BUYER_SSO } from '../../lib/mysql/models/LP_ADDRESS_BUYER_SSO';
import { LP_BUYER_PERSONAL_INFORMATION } from '../../lib/mysql/models/LP_BUYER_PERSONAL_INFORMATION';

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
      const buyerInfo: LP_BUYERAttributes = validatetoken(accessToken);
      let lpBuyer = await LP_BUYER.findByPk(buyerInfo.id);
      if (!lpBuyer) {
        lpBuyer = await LP_BUYER.create({
          id: buyerInfo.id,
        });
        await LP_ADDRESS_BUYER_SSO.create({
          buyerId: buyerInfo.id,
          email: `user${Math.floor(Math.random() * 10)}@example.com`,
          telephoneNumber: `+1${Math.floor(Math.random() * 9 + 10)}`,
          contactTelephoneNumber: `${Math.floor(Math.random() * 9 + 10)}`,
          postCode: `${Math.floor(Math.random() * 9 + 10)}`,
          prefectureCode: ['CA', 'TX', 'NY', 'FL'][
            Math.floor(Math.random() * 4)
          ],
          cityTown: ['CityA', 'CityB', 'CityC', 'CityD'][
            Math.floor(Math.random() * 4)
          ],
          buildingName: `Building ${Math.floor(Math.random() * 10)}`,
        });
        await LP_BUYER_PERSONAL_INFORMATION.create({
          buyerId: buyerInfo.id,
          nickname: `Nickname${Math.floor(Math.random() * 10)}`,
          firstName: `FirstName${Math.floor(Math.random() * 10)}`,
          lastName: `LastName${Math.floor(Math.random() * 10)}`,
          firstNameKana: `ファーストネーム${Math.floor(Math.random() * 10)}`,
          lastNameKana: `ラストネーム${Math.floor(Math.random() * 10)}`,
          prefectureCode: ['CA', 'TX', 'NY', 'FL'][
            Math.floor(Math.random() * 4)
          ],
          gender: Math.floor(Math.random() * 2),
          birthday: new Date().toString(),
          age: Math.floor(Math.random() * 10).toString(),
        });
      }

      if (!(await lpBuyer.hasStoreIdLpStore(storeId))) {
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
    username: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
  };
};
