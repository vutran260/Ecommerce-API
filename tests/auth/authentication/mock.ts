// all dependent mock should be on the top
import { API_KEY } from '../apikey/mock';

import User from '../../../src/lib/database/model/User';
import { Types } from 'mongoose';
import JWT, { JwtPayload } from '../../../src/lib/core/JWT';
import { BadTokenError } from '../../../src/lib/http/custom_error/ApiError';
import Keystore from '../../../src/lib/database/model/Keystore';
import * as authUtils from '../../../src/lib/auth/authUtils';
import { tokenInfo } from '../../../src/config';

export const ACCESS_TOKEN = 'xyz';

export const USER_ID = new Types.ObjectId(); // random id with object id format

export const getAccessTokenSpy = jest.spyOn(authUtils, 'getAccessToken');

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
  if (USER_ID.equals(id)) return { _id: new Types.ObjectId(id) } as User;
  else return null;
});

export const mockJwtValidate = jest.fn(
  async (token: string): Promise<JwtPayload> => {
    if (token === ACCESS_TOKEN)
      return {
        iss: tokenInfo.issuer,
        aud: tokenInfo.audience,
        sub: USER_ID.toHexString(),
        iat: 1,
        exp: 2,
        prm: 'abcdef',
      } as JwtPayload;
    throw new BadTokenError();
  },
);

export const mockKeystoreFindForKey = jest.fn(
  async (client: User, key: string): Promise<Keystore> =>
    ({ client: client, primaryKey: key } as Keystore),
);

jest.mock('../../../src/lib/database/repository/UserRepo', () => ({
  findById: mockUserFindById,
}));

jest.mock('../../../src/lib/database/repository/KeystoreRepo', () => ({
  findforKey: mockKeystoreFindForKey,
}));

JWT.validate = mockJwtValidate;

export const addHeaders = (request: any) =>
  request
    .set('Content-Type', 'application/json')
    .set('x-api-key', API_KEY)
    .timeout(2000);

export const addAuthHeaders = (request: any, accessToken = ACCESS_TOKEN) =>
  request
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('x-api-key', API_KEY)
    .timeout(2000);
