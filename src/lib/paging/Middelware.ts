import asyncHandler from '../helpers/asyncHandler';
import { GetOrder } from './Order';
import { PaginationRequest } from './Request';
import base64url from 'base64url';

export const pagingMiddelware = asyncHandler(async (req: PaginationRequest, res, next) => {

  try {
    GetFilter(req);
    GetPaging(req)
    GetOrder(req)

    return next();
  } catch (e) {
    throw e;
  }
});


const GetFilter = (req: PaginationRequest) => {
  const rawFilter = req.header('filter');
  if (!rawFilter) {
    return req.filterList = [];
  }
  const jsonFilter = base64url.decode(rawFilter);
  req.filterList = JSON.parse(jsonFilter);
};

const GetPaging = (req: PaginationRequest) => {
  const limit = req.query.limit;
  req.paging = { limit: 0, page: 0 }
  if (!!limit && !!Number(limit)) {
    req.paging.limit = Number(limit);
  }
  req.paging.limit = 20;

  const page = req.query.page;
  if (!!page && !!Number(page)) {
    req.paging.page = Number(page);
  }
  req.paging.page = 1

};