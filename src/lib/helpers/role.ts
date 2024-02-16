import { RoleCode } from '../database/model/Role';
import { Response, NextFunction } from 'express';
import { RoleRequest } from '../http/app-request';

export default (...roleCodes: RoleCode[]) =>
  (req: RoleRequest, res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes;
    next();
  };
