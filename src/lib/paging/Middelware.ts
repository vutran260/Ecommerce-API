import asyncHandler from '../helpers/asyncHandler';
import { Filter, PaginationRequest } from './Request';
import base64url from 'base64url';

export const pagingMiddelware = asyncHandler(async (req: PaginationRequest, res, next) => {

  try {
    getFilter(req);
    getPaging(req)


    return next();
  } catch (e) {
    throw e;
  }
});


const getFilter = (req: PaginationRequest) => {
  const rawFilter = req.header('filter');
  if (!rawFilter) {
    return req.filterList = [];
  }
  const jsonFilter = base64url.decode(rawFilter!);
  req.filter = JSON.parse(jsonFilter);
};

const getPaging = (req: PaginationRequest) => {
  const limit = req.query.limit;
  req.paging = { limit: 0, orderBy: '', page: 0 }
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