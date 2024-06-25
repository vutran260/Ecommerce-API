import axios, { AxiosInstance } from 'axios';
import { gmo } from '../../Config'
import { InternalErrorResponse } from '../../lib/http/ApiResponse';
import { SearchCardResponse } from './response/SearchCardResponse';
import Logger from '../../lib/core/Logger';
import { MemberResponse } from './response/MemberResponse';
import { GMOError } from './response/GMOError';
import { isEmpty } from 'lodash';

export class GMOPaymentService {

    private axiosInstance: AxiosInstance;

    constructor() {
        const apiUrl = gmo.url;
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': `application/json`
            }
        });
    }

    public getMemberById = async (memberId: string) => {
        try {

            Logger.info("getMemberDetails");

            const params = new URLSearchParams();
            params.append('SiteID', gmo.siteId);
            params.append('SitePass', gmo.sitePassword);
            params.append('MemberID', memberId)

            const response = await this.axiosInstance.post(`/payment/SearchMember.idPass`,
                {}, { params }
            );
            Logger.info(response.data);

            const error = new GMOError(response.data);
            if (!isEmpty(error.errCode) && !isEmpty(error.errInfo)) {
                if (this.resourceNotfound(error)) {
                    Logger.info("Member is not existed")
                    return null;
                }
                this.handleError(error);
            }

            return new MemberResponse(response.data);
        } catch (error) {
            Logger.error("GetMemberDetails got error");
            Logger.error(error);
            throw error;
        }
    }

    public registerMember = async (memberId: string) => {
        try {
            Logger.info("registerMember");
            const params = new URLSearchParams();
            params.append('SiteID', gmo.siteId);
            params.append('SitePass', gmo.sitePassword);
            params.append('MemberID', memberId);

            const response = await this.axiosInstance.post(`/payment/SaveMember.idPass`,
                {}, { params }
            );

            const error = new GMOError(response.data);
            if (!isEmpty(error.errCode) && !isEmpty(error.errInfo)) {
                this.handleError(error);
            }

            return new MemberResponse(response.data);
        } catch (error) {
            Logger.error("registerMember got error");
            Logger.error(error);
            throw error;
        }
    }

    public saveCard = async (memberId: string, token: string) => {
        try {
            Logger.info("saveCard", memberId, token);

            const params = new URLSearchParams();
            params.append('SiteID', gmo.siteId);
            params.append('SitePass', gmo.sitePassword);
            params.append('MemberID', memberId);
            params.append('Token', token);

            const response = await this.axiosInstance.post(`/payment/SaveCard.idPass`,
                {}, { params }
            );

            const error = new GMOError(response.data);
            if (!isEmpty(error.errCode) && !isEmpty(error.errInfo)) {
                this.handleError(error);
            }

            return new MemberResponse(response.data);
        } catch (error) {
            Logger.error("saveCard got error", error);
            Logger.error(error);
            throw error;
        }
    }

    public searchCard = async (memberId: string, cardSeq: string) => {
        try {
            const params = new URLSearchParams();
            params.append('SiteID', gmo.siteId);
            params.append('SitePass', gmo.sitePassword);
            params.append('MemberID', memberId);
            params.append('CardSeq', cardSeq);
            const response = await this.axiosInstance.post(`/payment/SearchCard.idPass`,
                {}, { params }
            );
            Logger.info(response.data);

            const error = new GMOError(response.data);
            if (!isEmpty(error.errCode) && !isEmpty(error.errInfo)) {
                if (this.resourceNotfound(error)) {
                    Logger.info("Card is not existed")
                    return null;
                }
                this.handleError(error);
            }

            return new SearchCardResponse(response.data);
        } catch (error) {
            Logger.error("searchCard got error");
            Logger.error(error);
            throw error;
        }
    }

    private handleError(error: GMOError) {
        Logger.error("GMO respond error ");
        Logger.error(error);
        throw new InternalErrorResponse(error.errInfo);
    }

    private resourceNotfound(data: GMOError) {
        return data.errCode === GMO_RESOURCE_NOT_FOUND;
    }
}

export const GMO_RESOURCE_NOT_FOUND = "E01"

