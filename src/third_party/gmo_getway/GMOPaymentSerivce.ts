import { gmo } from '../../Config';
import Logger from '../../lib/core/Logger';
import {
  BadRequestError,
  InternalError,
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
import { errorCodesConstant } from './utils/ErrorCodesConstant';

export class GMOPaymentService {
  public getMemberById = async (memberId: string) => {
    Logger.info('getMemberDetails');

    const endpoint = `${gmo.url}/payment/SearchMember.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);
    if (!response.ok) {
      if (this.isResourceNotfound(jsonData)) {
        return null;
      }
      this.handlerError(response, jsonData);
    }

    return new MemberResponse(
      jsonData.memberID,
      jsonData.memberName,
      jsonData.deleteFlag,
    );
  };

  public registerMember = async (memberId: string) => {
    Logger.info('registerMember');

    const endpoint = `${gmo.url}/payment/SaveMember.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);

    if (!response.ok) {
      this.handlerError(response, jsonData);
    }

    return new MemberResponse(
      jsonData.memberID,
      jsonData.memberName,
      jsonData.DeleteFlag,
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
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);

    if (!response.ok) {
      this.handlerError(response, jsonData);
    }

    return new CardResponse(
      jsonData.cardSeq,
      jsonData.cardNo,
      jsonData.expire,
      jsonData.defaultFlag,
      jsonData.cardName,
      jsonData.holderName,
      jsonData.deleteFlag,
      jsonData.brand,
      jsonData.domesticFlag,
      jsonData.issuerCode,
      jsonData.debitPrepaidFlag,
      jsonData.debitPrepaidIssuerName,
      jsonData.forwardFinal,
    );
  };

  public searchCard = async (memberId: string) => {
    const endpoint = `${gmo.url}/payment/SearchCard.json`;
    const request = new SiteRequest(gmo.siteId, gmo.sitePassword, memberId);

    const requestJson = JSON.stringify(request);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    if (!response.ok) {
      if (this.isResourceNotfound(jsonData)) {
        return null;
      }
      this.handlerError(response, jsonData);
    }

    console.log('Received data:', jsonData, 'status', response.status);

    const results: CardResponse[] = [];
    jsonData.forEach((card: CardResponse) => {
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
  };

  private isResourceNotfound(data: any) {
    return data.filter((gmoError: GMOError) => {
      return gmoError.errCode === GMO_RESOURCE_NOT_FOUND;
    });
  }

  private handlerError = (response: Response, errorList: any) => {
    console.log(errorList);
    switch (response.status) {
      case 400:
        errorList.forEach((error: GMOError) => {
          const description: string = errorCodesConstant[error.errInfo];
          throw new BadRequestError(description);
        });

      case 500:
        errorList.forEach((error: GMOError) => {
          const description: string = errorCodesConstant[error.errInfo];
          throw new InternalError(description);
        });
        break;
      case 502:
        errorList.forEach((error: GMOError) => {
          const description: string = errorCodesConstant[error.errInfo];
          throw new InternalError(description);
        });
        break;
      default:
        throw new InternalError('GMO server got eror');
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
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);

    if (!response.ok) {
      this.handlerError(response, jsonData);
    }

    return new CheckPointResponse(
      jsonData.siftOrderID,
      jsonData.paymentAbuseScore,
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
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);

    if (!response.ok) {
      this.handlerError(response, jsonData);
    }

    return new EntryTransactionResponse(jsonData.accessID, jsonData.accessPass);
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
    const requestJson = JSON.stringify(request);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestJson,
    });

    const jsonData = await response.json();
    console.log('Received data:', jsonData, 'status', response.status);

    if (!response.ok) {
      this.handlerError(response, jsonData);
    }

    return new ExecTransactionResponse(jsonData.acs, jsonData.redirectUrl);
  };
}

export const GMO_RESOURCE_NOT_FOUND = 'E01';
