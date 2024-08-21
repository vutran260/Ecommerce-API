import { Paging } from '../paging/Request';
import { Response } from 'express';
import { ApiError } from './custom_error/ApiError';
import { ErrorType } from './custom_error/ErrorType';
import Logger from '../core/Logger';
import { StatusCode } from 'src/lib/http/custom_error/StatusCode';

export interface LPResponse {
  error?: LPError;
  data?: any;
  metadata: LPMetadata;
}

export interface LPMetadata {
  statusCode: string;
  responseUid?: string;
  paging?: Paging;
}

export interface LPError {
  errorCode?: string;
  errorMessage?: string;
  errorType?: string;
}

export const ResponseData = (data: any, res: Response) => {
  const response: LPResponse = {
    data: data,
    metadata: {
      statusCode: '00',
    },
  };

  return res.json(response);
};

export const ResponseListData = (data: any, res: Response, paging: Paging) => {
  const response: LPResponse = {
    data: data,
    metadata: {
      statusCode: '00',
      paging: paging,
    },
  };

  return res.json(response);
};

export const ResponseError = (err: Error, res: Response) => {
  Logger.error(err);

  if (err instanceof ApiError) {
    const response: LPResponse = {
      error: {
        errorCode: err.errorCode,
        errorMessage: err.message,
        errorType: err.type,
      },
      metadata: {
        statusCode: err.statusCode,
      },
    };

    return res.json(response);
  }

  const response: LPResponse = {
    error: {
      errorCode: `10`,
      errorMessage: err.message,
      errorType: ErrorType.INTERNAL,
    },
    metadata: {
      statusCode: `10`,
    },
  };

  return res.json(response);
};

export const ResponseDataError = (
  error: any,
  statusCode: StatusCode,
  res: Response,
) => {
  const response: LPResponse = {
    error: error,
    metadata: {
      statusCode: statusCode,
    },
  };

  return res.json(response);
};
