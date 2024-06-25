import axios, { AxiosInstance } from 'axios';
import { SaveMemberRequest } from './request/SaveMemberRequest';
import { gmo } from '../../Config'
import { convertToRecordString, getErrorInfo, GMO_ERROR_USER_NOT_EXIST, hasError } from './GMOUtils';
import { InternalErrorResponse } from '../../lib/http/ApiResponse';
import { SearchCardResponse } from './response/SearchCardResponse';
import Logger from '../../lib/core/Logger';
import { SaveCardRequest } from './request/SaveCardRequest';
import { GMOError } from './response/GMOError';
import { any } from 'joi';

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

    public getMemberDetails = async (memberId: string) => {
        try {

            Logger.info("getMemberDetails", memberId);
            const request = new SaveMemberRequest(memberId, gmo.siteId, gmo.sitePassword);
            const params = new URLSearchParams(convertToRecordString(request));

            const response = await this.axiosInstance.post(`/payment/SearchMember.idPass`,
                params
            );

            if (this.memberIsNotExited(response.data)){
                return  "";
            }

            if (hasError(response.data)) {
                this.handleError(response.data);

            }

            return  response.data.get("MemberID");
        } catch (error) {
            Logger.error("GetMemberDetails got error");
            Logger.error(error);
            throw error;
        }
    }



    public registerMember = async (memberId: string) => {
        try {
            Logger.info("registerMember", memberId);

            const request = new SaveMemberRequest(memberId, gmo.siteId, gmo.sitePassword);
            const params = new URLSearchParams(convertToRecordString(request));

            const response = await this.axiosInstance.post(`/payment/SaveMember.idPass`,
                params
            );

            if (hasError(response.data)) {
                this.handleError(response.data);
            }

            return response.data.get("MemberID");
        } catch (error) {
            Logger.error("registerMember got error");
            Logger.error(error);
            throw error;
        }
    }

    public saveCard = async (memberId: string, token: string) => {
        try {
            Logger.info("saveCard", memberId, token);

            const request = new SaveCardRequest(memberId, gmo.siteId, gmo.sitePassword, token);
            const params = new URLSearchParams(convertToRecordString(request));
            const response = await this.axiosInstance.post(`/payment/SaveCard.idPass`,
                params
            );

            if (hasError(response.data)) {
                this.handleError(response.data);
            }

            return response.data.get("MemberID");
        } catch (error) {
            Logger.error("saveCard got error", error);
            Logger.error(error);
            throw error;
        }
    }

    public searchCard = async (memberId: string) => {
        try {
            const request = new SaveMemberRequest(memberId, gmo.siteId, gmo.sitePassword);
            const params = new URLSearchParams(convertToRecordString(request));
            const response = await this.axiosInstance.post(`/payment/SearchCard.idPass`,
                params
            );

            if (hasError(response.data)) {
                this.handleError(response.data);
            }

            return new SearchCardResponse(response.data);
        } catch (error) {
            Logger.error("searchCard got error");
            Logger.error(error);
            throw error;
        }
    }

    private handleError(data: string) {
        const errorInfo = getErrorInfo(data);
        Logger.error("GMO respond error ");
        Logger.error(data);
        throw new InternalErrorResponse(errorInfo);
    }

    private memberIsNotExited(data: string) {
        const errorInfo = getErrorInfo(data);
        return errorInfo === GMO_ERROR_USER_NOT_EXIST

    }


}


