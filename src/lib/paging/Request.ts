import { ProtectedRequest } from '../http/app-request';
import { Op } from 'sequelize';
import lodash from 'lodash';
import { LpOrder } from './Order';

export interface PaginationRequest extends ProtectedRequest {
  paging: Paging;
  filterList: Filter[];
  order: LpOrder[];
}

export declare interface Paging {
  limit: number;
  page: number;
  total?: number;
}

export const GetOffset = (p: Paging) => {
  return (p.page - 1) * p.limit;
};

export declare interface Filter {
  operation: string;
  value: any;
  attribute: string;
}

export const BuildQuery = (filter: Filter[]) => {
  return {
    [Op.and]: filter.map((filter) => getOperatorFromFilter(filter)),
  };
};

const getOperatorFromFilter = (input: Filter) => {
  const operator = {
    [lodash.get(Op, input.operation)]: input.value,
  };

  const out = {};
  lodash.set(out, input.attribute, operator);

  return out;
};
