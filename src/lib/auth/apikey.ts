import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';
import { PublicRequest } from '../types/app-request';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    const apiKey = await ApiKeyRepo.findByKey(key);
    if (!apiKey) throw new ForbiddenError();
    Logger.info(apiKey);

    req.apiKey = apiKey;
    return next();
  }),
);
