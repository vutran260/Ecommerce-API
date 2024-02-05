import { ProtectedRequest } from '../types/app-request';
import { PgColumn } from 'drizzle-orm/pg-core';
import { SQL } from 'drizzle-orm/sql/sql';
import { and, eq, gt, gte, ilike, inArray, like, lt, lte, ne, not } from 'drizzle-orm';
import { BadRequestError } from '../core/ApiError';

export declare interface PaginationRequest extends ProtectedRequest {
  paging: Paging
  filter: Filter [],
}


export declare interface Paging {
  limit: number,
  page: number,
  orderBy: string,
}

export declare interface Filter {
  operation: string;
  value: any;
  attribute: string;
  not: boolean;
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
  (colName: string): PgColumn;
}
