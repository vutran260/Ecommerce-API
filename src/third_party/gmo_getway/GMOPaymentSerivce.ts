import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { gmo } from '../../Config';
import Logger from '../../lib/core/Logger';
import {
  InternalError,
  PaymentError,
} from '../../lib/http/custom_error/ApiError';
import { CheckPointRequest } from './request/CheckPointRequest';
import {
  EntryTransactionRequest,
  TransactionRequest,
} from './request/EntryTransactionRequest';
import {
  ExecTransactionRequest,
  PreExecTransactionRequest,
} from './request/ExecTransactionRequest';
import { SaveCardRequest } from './request/SaveCardRequest';
import { SiteRequest } from './request/SiteRequest';
import { CardResponse } from './response/CardResponse';
import { CheckPointResponse } from './response/CheckPointResponse';
import { EntryTransactionResponse } from './response/EntryTransactionResponse';
import { ExecTransactionResponse } from './response/ExecTransactionResponse';
import { GMOError } from './response/GMOError';
import { MemberResponse } from './response/MemberResponse';

export class GMOPaymentService {
  public getMemberById = async (memberId: string) => {
    Logger.info('getMemberDetails');

    const endpoint = `${gmo.url}/payment/SearchMember.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);

    try {
      const response = await axios.post(endpoint, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Received data:', response.data, 'status', response.status);
      if (response.status !== HttpStatusCode.Ok) {
        if (this.isResourceNotfound(response.data)) {
          return null;
        }
        this.handlerError(response, response.data);
      }

      return new MemberResponse(
        response.data.memberID,
        response.data.memberName,
        response.data.deleteFlag,
      );
    } catch (e) {
      Logger.error(e);
      return null;
    }
  };

  public registerMember = async (memberId: string) => {
    Logger.info('registerMember');
    const endpoint = `${gmo.url}/payment/SaveMember.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);
    const response = await axios.post(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received data:', response.data, 'status', response.status);
    if (response.status !== HttpStatusCode.Ok) {
      this.handlerError(response, response.data);
    }

    return new MemberResponse(
      response.data.memberID,
      response.data.memberName,
      response.data.DeleteFlag,
    );
  };

  public saveCard = async (memberId: string, token: string) => {
    Logger.info('saveCard', memberId, token);

    const endpoint = `${gmo.url}/payment/SaveCard.json`;
    const request = new SaveCardRequest(
      gmo.siteId,
      gmo.sitePassword,
      memberId,
      token,
    );
    const response = await axios.post(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received data:', response.data, 'status', response.status);
    if (response.status !== HttpStatusCode.Ok) {
      this.handlerError(response, response.data);
    }

    return new CardResponse(
      response.data.cardSeq,
      response.data.cardNo,
      response.data.expire,
      response.data.defaultFlag,
      response.data.cardName,
      response.data.holderName,
      response.data.deleteFlag,
      response.data.brand,
      response.data.domesticFlag,
      response.data.issuerCode,
      response.data.debitPrepaidFlag,
      response.data.debitPrepaidIssuerName,
      response.data.forwardFinal,
    );
  };

  public searchCard = async (memberId: string) => {
    const endpoint = `${gmo.url}/payment/SearchCard.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);

    try {
      const response = await axios.post(endpoint, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== HttpStatusCode.Ok) {
        if (this.isResourceNotfound(response.data)) {
          return null;
        }
        this.handlerError(response, response.data);
      }

      console.log('Received data:', response.data, 'status', response.status);

      const results: CardResponse[] = [];
      response.data.forEach((card: CardResponse) => {
        results.push(
          new CardResponse(
            card.cardSeq,
            card.cardNo,
            card.expire,
            card.defaultFlag,
            card.cardName,
            card.holderName,
            card.deleteFlag,
            card.brand,
            card.domesticFlag,
            card.issuerCode,
            card.debitPrepaidFlag,
            card.debitPrepaidIssuerName,
            card.forwardFinal,
          ),
        );
      });

      return results;
    } catch (e) {
      Logger.error(e);
      return null;
    }
  };

  public checkFraud = async (type: string, userId: string) => {
    Logger.info('checkpoint', userId, type);

    const endpoint = `${gmo.url}/payment/SiftEvents.json`;
    const request = new CheckPointRequest(
      gmo.shopId,
      gmo.shopPassword,
      type,
      userId,
    );

    const response = await axios.post(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received data:', response.data, 'status', response.status);

    if (response.status !== HttpStatusCode.Ok) {
      this.handlerError(response, response.data);
    }

    return new CheckPointResponse(
      response.data.siftOrderID,
      response.data.paymentAbuseScore,
    );
  };

  public entryTran = async (input: TransactionRequest) => {
    Logger.info('entry transaction', input.orderID);

    const endpoint = `${gmo.url}/payment/EntryTran.json`;
    const request = new EntryTransactionRequest(
      gmo.shopId,
      gmo.shopPassword,
      input.orderID,
      input.jobCd,
      input.amount,
    );

    const response = await axios.post(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received data:', response.data, 'status', response.status);

    if (response.status !== HttpStatusCode.Ok) {
      this.handlerError(response, response.data);
    }

    return new EntryTransactionResponse(
      response.data.accessID,
      response.data.accessPass,
    );
  };

  public execTran = async (input: ExecTransactionRequest) => {
    Logger.info('exec transaction with MemberID', input.memberID);

    const endpoint = `${gmo.url}/payment/ExecTran.json`;
    const request = new PreExecTransactionRequest(
      gmo.siteId,
      gmo.sitePassword,
      input.accessID,
      input.accessPass,
      input.memberID,
      input.cardSeq,
      input.orderID,
      input.method,
    );

    const response = await axios.post(endpoint, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received data:', response.data, 'status', response.status);

    if (response.status !== HttpStatusCode.Ok) {
      this.handlerError(response, response.data);
    }

    return new ExecTransactionResponse(
      response.data.acs,
      response.data.redirectUrl,
    );
  };

  private isResourceNotfound(data: any) {
    return data.filter((gmoError: GMOError) => {
      return gmoError.errCode === GMO_RESOURCE_NOT_FOUND;
    });
  }

  private handlerError = (response: AxiosResponse, errorList: any) => {
    console.log(errorList);
    switch (response.status) {
      case 400:
      case 500:
      case 502:
        errorList.forEach((error: GMOError) => {
          const description: string = error.errInfo;
          throw new PaymentError(description);
        });
        break;
      default:
        throw new InternalError('GMO server got eror');
    }
  };
}

export const GMO_RESOURCE_NOT_FOUND = 'E01';
