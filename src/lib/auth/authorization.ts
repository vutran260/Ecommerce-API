import express from 'express';
import { AuthFailureError } from '../http/custom_error/ApiError';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';
import { ProtectedRequest } from '../http/app-request';

const router = express.Router();

export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    // if (!req.user || !req.user.roles || !req.currentRoleCodes)
    if (!req.user || !req.currentRoleCodes)
      throw new AuthFailureError('Permission denied');

    const roles = await RoleRepo.findByCodes(req.currentRoleCodes);
    if (roles.length === 0) throw new AuthFailureError('Permission denied');

    // let authorized = false;

    // for (const userRole of req.user.roles) {
    //   if (authorized) break;
    //   for (const role of roles) {
    //     if (userRole._id.equals(role._id)) {
    //       authorized = true;
    //       break;
    //     }
    //   }
    // }

    // if (!authorized) throw new AuthFailureError('Permission denied');

    return next();
  }),
);
