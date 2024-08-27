import express from 'express';
import { ForbiddenError } from '../http/custom_error/ApiError';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';
import { PublicRequest } from '../http/app-request';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    // const apiKey = await ApiKeyRepo.findByKey(key);
    const apiKey = key === 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj';
    if (!apiKey) throw new ForbiddenError();

    // req.apiKey = apiKey;
    return next();
  }),
);
