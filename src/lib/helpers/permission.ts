import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../http/custom_error/ApiError';
import { PublicRequest } from '../http/app-request';

export default (permission: string) =>
  (req: PublicRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.apiKey?.permissions)
        return next(new ForbiddenError('Permission Denied'));

      const exists = req.apiKey.permissions.find(
        (entry) => entry === permission,
      );
      if (!exists) return next(new ForbiddenError('Permission Denied'));

      next();
    } catch (error) {
      next(error);
    }
  };
