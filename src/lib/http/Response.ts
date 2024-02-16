import { Paging } from '../paging/Request';
import { Response } from 'express';

export interface LPResponse {
  error?: LPError;
  data?: any;
  metadata: LPMetadata;
}

export interface LPMetadata {
  statusCode: string,
  responseUid?: string,
  paging?: Paging,
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


