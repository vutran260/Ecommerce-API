import Keystore from '../../lib/database/model/Keystore';
import { Request } from 'express';
export  declare interface AdminProtectedRequest extends  Request{
  admin: any;
  accessToken: string;
  keystore: Keystore;
}
