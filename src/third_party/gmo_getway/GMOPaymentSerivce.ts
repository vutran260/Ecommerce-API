import { gmo } from '../../Config'
import { CardResponse } from './response/CardResponse';
import Logger from '../../lib/core/Logger';
import { MemberResponse } from './response/MemberResponse';
import { SiteRequest } from './request/SiteRequest';
import { SaveCardRequest } from './request/SaveCardRequest';
import { GMOError } from './response/GMOError';
import { BadRequestError, InternalError } from '../../lib/http/custom_error/ApiError';
import { errorCodes } from './utils/error-codes';

export class GMOPaymentService {

    public getMemberById = async (memberId: string) => {
        Logger.info("getMemberDetails");

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
            this.handlerError(response,jsonData);
        }

        return new MemberResponse(jsonData.memberID, jsonData.memberName, jsonData.deleteFlag);
    }

    public registerMember = async (memberId: string) => {
        Logger.info("registerMember");

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
            this.handlerError(response,jsonData);
        }

        return new MemberResponse(jsonData.memberID, jsonData.memberName, jsonData.DeleteFlag);

    }

    public saveCard = async (memberId: string, token: string) => {

        Logger.info("saveCard", memberId, token);

        const endpoint = `${gmo.url}/payment/SaveCard.json`;
        const request = new SaveCardRequest(gmo.siteId, gmo.sitePassword, memberId, token);
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
            this.handlerError(response,jsonData);
        }

        return new CardResponse(jsonData.cardSeq,
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
            jsonData.forwardFinal);
    }

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
             this.handlerError(response,jsonData);
        }

        console.log('Received data:', jsonData, 'status', response.status);

        const results: CardResponse[] = [];
        jsonData.forEach((card: CardResponse) => {
            results.push(new CardResponse(card.cardSeq,
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
                card.forwardFinal))
        })

        return results;

    }

    private isResourceNotfound(data: any) {
        return data.filter((gmoError: GMOError) => { return gmoError.errCode === GMO_RESOURCE_NOT_FOUND });
    }

    private handlerError =  (response: Response, errorList: any) => {
        console.log(errorList)
        switch (response.status) {
            case 400:
                errorList.forEach((error: GMOError) => {
                    const description :string = errorCodes[error.errInfo];
                    throw new BadRequestError(description);
                })

            case 500:
                errorList.forEach((error: GMOError) => {
                    const description :string = errorCodes[error.errInfo];
                    throw new InternalError(description);
                })
            break;
            case 502:
                errorList.forEach((error: GMOError) => {
                    const description :string = errorCodes[error.errInfo];
                    throw new InternalError(description);
                })
                break;
            default:
                throw new InternalError("GMO server got eror");
        }
    }

}

export const GMO_RESOURCE_NOT_FOUND = "E01"

