import { ProtectedRequest } from '../http/app-request';
import { SQL } from 'drizzle-orm/sql/sql';
import { and, eq, gt, gte, ilike, inArray, like, lt, lte, ne, not } from 'drizzle-orm';
import { BadRequestError } from '../http/custom_error/ApiError';
import { MySqlColumn } from 'drizzle-orm/mysql-core';
import { Op } from 'sequelize';
import lodash from 'lodash';

export interface PaginationRequest extends ProtectedRequest {
  paging: Paging,
  filterList: Filter []
}
 

export declare interface Paging {
  limit: number,
  page: number,
  orderBy?: string,
  total?: number,
}

export const GetOffset = (p: Paging) => {
  return (p.page-1) * p.limit
}

export declare interface Filter {
  operation: string;
  value: any;
  attribute: string;
  not: boolean;
}


export const BuildQuery = (filter: Filter[]) => {
  console.log("filtering", filter)
  return {
    [Op.and]:filter.map(filter => getOperatorFromFilter(filter))
  } 
}

const getOperatorFromFilter = (input: Filter) => {
  const operator = {
      [lodash.get(Op,input.operation)]: input.value
  }

  const out = {}
  lodash.set(out, input.attribute, operator)

  return out
}


export const getRepoFilter = (input: Filter[], getColumnFunc: getColumnFunc):SQL|undefined => {
  let out: any[] = [];
  for (const filter of input) {
    out = out.concat(filterToRepoFilter(filter,  getColumnFunc));
  }
  return and(...out);
};

const filterToRepoFilter = (input: Filter, getColumnFunc: getColumnFunc): SQL => {
  let out: SQL ;
  switch (input.operation) {
    case 'eq':
      out = eq(getColumnFunc(input.attribute), input.value);
      break;
    case 'ne':
      out = ne(getColumnFunc(input.attribute), input.value);
      break;
    case 'not':
      out = not(inArray(getColumnFunc(input.attribute), input.value));
      break;
    case 'in':
      out = inArray(getColumnFunc(input.attribute), input.value);
      break;
    case 'gt' :
      out = gt(getColumnFunc(input.attribute), input.value);
      break;
    case 'gte' :
      out = gte(getColumnFunc(input.attribute), input.value);
      break;
    case 'lt' :
      out = lt(getColumnFunc(input.attribute), input.value);
      break;
    case 'lte' :
      out = lte(getColumnFunc(input.attribute), input.value);
      break;
    case 'like' :
      out = like(getColumnFunc(input.attribute), input.value);
      break;
    case 'ilike' :
      out = ilike(getColumnFunc(input.attribute), input.value);
      break;
    default:
      throw new BadRequestError('invalid filter operation');
  }
  if (input.not) {
    return not(out);
  }
  return out;
};

export interface getColumnFunc {
  (colName: string): MySqlColumn;
}
