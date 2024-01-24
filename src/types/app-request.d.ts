import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/Keystore';
import ApiKey from '../database/model/ApiKey';
import { Users } from '../entity/entities/Users';

declare interface PublicRequest extends Request {
  apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  user: Users;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
