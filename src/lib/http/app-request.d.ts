import { Request } from 'express';
import Keystore from '../database/model/Keystore';
import ApiKey from '../database/model/ApiKey';
import { LP_ADMINAttributes } from '../mysql/models/LP_ADMIN';
import { LP_SELLERAttributes } from '../mysql/models/LP_SELLER';
import { LP_BUYERAttributes } from '../mysql/models/LP_BUYER';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  user: LP_ADMINAttributes | LP_SELLERAttributes | LP_BUYERAttributes;
  storeId: string;
  accessToken: string;
  keystore: Keystore;
  timezone: string;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
