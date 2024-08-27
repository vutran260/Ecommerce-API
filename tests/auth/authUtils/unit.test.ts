import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './mock';
import {
  validateTokenData,
  createTokens,
} from '../../../src/lib/auth/authUtils';
import { JwtPayload } from '../../../src/lib/core/JWT';
import { tokenInfo } from '../../../src/Config';
import { Types } from 'mongoose';
import { AuthFailureError } from '../../../src/lib/http/custom_error/ApiError';
import User from '../../../src/lib/database/model/User';

describe('authUtils validateTokenData tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  it('Should throw error when subject in not user id format', async () => {
    const payload = new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      'abc',
      ACCESS_TOKEN_KEY,
      tokenInfo.accessTokenValidity,
    );

    try {
      validateTokenData(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthFailureError);
    }
  });

  it('Should throw error when access token key is different', async () => {
    const payload = new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      new Types.ObjectId().toHexString(),
      '123',
      tokenInfo.accessTokenValidity,
    );

    try {
      validateTokenData(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthFailureError);
    }
  });

  it('Should return true if all data is correct', async () => {
    const payload = new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      new Types.ObjectId().toHexString(), // Random Key
      ACCESS_TOKEN_KEY,
      tokenInfo.accessTokenValidity,
    );

    const validatedPayload = validateTokenData(payload);

    expect(validatedPayload).toBeTruthy();
  });
});

describe('authUtils createTokens function', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  it('Should process and return accessToken and refreshToken', async () => {
    const userId = new Types.ObjectId(); // Random Key

    const tokens = await createTokens(
      { _id: userId } as User,
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
    );

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });
});
