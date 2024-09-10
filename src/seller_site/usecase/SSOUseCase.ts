import axios, { HttpStatusCode } from 'axios';
import { lpSequelize } from '../../lib/mysql/Connection';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import { sso } from '../../Config';
import Logger from '../../lib/core/Logger';
import { StaffInfo } from '../../common/model/sso/StaffInfo';
import { LP_SELLER } from '../../lib/mysql/models/LP_SELLER';
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';
import { StoreInfo } from '../../common/model/sso/StoreInfo';
import {
  LP_SELLER_SSO,
  LP_STORE_SSO,
} from '../../lib/mysql/models/init-models';
import moment from 'moment';

export class SSOUseCase {
  public async registerSSOStaffAndStore(
    accessToken: string,
    staffAlias: string,
    storeAlias: string,
  ) {
    Logger.info(
      `Register sso staff with staffAlias: '${staffAlias}' and storeAlias: '${storeAlias}'`,
    );

    const staffSSOInfo = await this.getStaffInfo(staffAlias, accessToken);
    if (!staffSSOInfo) {
      throw new InternalError(
        `SSO staff with staffAlias: '${staffAlias}' not found.`,
      );
    }

    const storeSSOInfo = await this.getStoreInfo(storeAlias, accessToken);
    if (!storeSSOInfo) {
      throw new InternalError(
        `SSO store with storeAlias: '${storeAlias}' not found.`,
      );
    }

    let lpSeller = await LP_SELLER.findByPk(staffAlias);
    let lpStore = await LP_STORE.findByPk(storeAlias);
    if (lpSeller && lpStore) {
      Logger.info(
        `staffAlias: '${staffAlias}' and storeAlias: '${staffAlias}' already registered in DB`,
      );
      Logger.info(
        `SSO Successfully response sellerId: '${lpSeller.id}' and storeId: '${lpStore.id}'`,
      );
      return {
        sellerId: lpSeller.id,
        storeId: lpStore.id,
      };
    }

    const t = await lpSequelize.transaction();
    try {
      if (!lpSeller) {
        lpSeller = await LP_SELLER.create(
          {
            id: staffAlias,
            storeId: storeAlias,
            email: staffSSOInfo.email,
          },
          {
            transaction: t,
          },
        );

        await LP_SELLER_SSO.create(
          {
            sellerId: lpSeller.id,
            username: staffSSOInfo.username,
            firstNameKanji: staffSSOInfo.first_name_kanji,
            lastNameKanji: staffSSOInfo.last_name_kanji,
            firstNameKana: staffSSOInfo.first_name_kana,
            lastNameKana: staffSSOInfo.last_name_kana,
            birthday: moment(staffSSOInfo.birthday).toDate(),
            email: staffSSOInfo.email,
          },
          {
            transaction: t,
          },
        );
      }

      if (!lpStore) {
        lpStore = await LP_STORE.create(
          {
            id: storeAlias,
            contractId: '',
            storeKey: storeSSOInfo.store_code,
            storeName: storeSSOInfo.store_name,
            storeNameKana: storeSSOInfo.store_name,
            companyName: '',
            companyAddress: '',
          },
          {
            transaction: t,
          },
        );

        await LP_STORE_SSO.create(
          {
            storeId: storeAlias,
            storeName: storeSSOInfo.store_name,
            storeShortName: storeSSOInfo.store_short_name,
            storeCode: storeSSOInfo.store_code,
            postalCode: storeSSOInfo.postal_code,
            prefecture: storeSSOInfo.prefecture,
            address: storeSSOInfo.address,
            searchIndex: storeSSOInfo.search_index,
            phoneNumber: storeSSOInfo.phone_number,
            faxNumber: storeSSOInfo.fax_number,
            longitude: parseFloat(storeSSOInfo.longitude), // Assuming longitude is a string, convert to number
            latitude: parseFloat(storeSSOInfo.latitude), // Assuming latitude is a string, convert to number
            transportation: storeSSOInfo.transportation,
            newsFromStore: storeSSOInfo.news_from_store,
            regularHoliday: storeSSOInfo.regular_holiday,
            existParking: storeSSOInfo.exist_parking,
            parkingComment: storeSSOInfo.parking_comment,
            canCreditCard: storeSSOInfo.can_credit_card,
            canUseCreditCardBrands: storeSSOInfo.can_use_credit_card_brands,
            canElectronicMoney: storeSSOInfo.can_electronic_money,
            canElectronicMoneyBrands: storeSSOInfo.can_electronic_money_brands,
            canBarCodePayment: storeSSOInfo.can_bar_code_payment,
            canBarCodePaymentBrands: storeSSOInfo.can_bar_code_payment_brands,
            mondayBusinessFromTime: storeSSOInfo.monday_business_from_time,
            mondayBusinessEndTime: storeSSOInfo.monday_business_end_time,
            tuesdayBusinessFromTime: storeSSOInfo.tuesday_business_from_time,
            tuesdayBusinessEndTime: storeSSOInfo.tuesday_business_end_time,
            wednesdayBusinessFromTime:
              storeSSOInfo.wednesday_business_from_time,
            wednesdayBusinessEndTime: storeSSOInfo.wednesday_business_end_time,
            thursdayBusinessFromTime: storeSSOInfo.thursday_business_from_time,
            thursdayBusinessEndTime: storeSSOInfo.thursday_business_end_time,
            fridayBusinessFromTime: storeSSOInfo.friday_business_from_time,
            fridayBusinessEndTime: storeSSOInfo.friday_business_end_time,
            saturdayBusinessFromTime: storeSSOInfo.saturday_business_from_time,
            saturdayBusinessEndTime: storeSSOInfo.saturday_business_end_time,
            sundayBusinessFromTime: storeSSOInfo.sunday_business_from_time,
            sundayBusinessEndTime: storeSSOInfo.sunday_business_end_time,
            nationalHolidayBusinessFromTime:
              storeSSOInfo.national_holiday_business_from_time,
            nationalHolidayBusinessEndTime:
              storeSSOInfo.national_holiday_business_end_time,
            businessTimeDisplay: storeSSOInfo.business_time_display,
            isIncludeDisplayNationalHoliday:
              storeSSOInfo.is_include_display_national_holiday,
            businessTimeComment: storeSSOInfo.business_time_comment,
            mondayReceptionFromTime: storeSSOInfo.monday_reception_from_time,
            mondayReceptionEndTime: storeSSOInfo.monday_reception_end_time,
            tuesdayReceptionFromTime: storeSSOInfo.tuesday_reception_from_time,
            tuesdayReceptionEndTime: storeSSOInfo.tuesday_reception_end_time,
            wednesdayReceptionFromTime:
              storeSSOInfo.wednesday_reception_from_time,
            wednesdayReceptionEndTime:
              storeSSOInfo.wednesday_reception_end_time,
            thursdayReceptionFromTime:
              storeSSOInfo.thursday_reception_from_time,
            thursdayReceptionEndTime: storeSSOInfo.thursday_reception_end_time,
            fridayReceptionFromTime: storeSSOInfo.friday_reception_from_time,
            fridayReceptionEndTime: storeSSOInfo.friday_reception_end_time,
            saturdayReceptionFromTime:
              storeSSOInfo.saturday_reception_from_time,
            saturdayReceptionEndTime: storeSSOInfo.saturday_reception_end_time,
            sundayReceptionFromTime: storeSSOInfo.sunday_reception_from_time,
            sundayReceptionEndTime: storeSSOInfo.sunday_reception_end_time,
            nationalHolidayReceptionFromTime:
              storeSSOInfo.national_holiday_reception_from_time,
            nationalHolidayReceptionEndTime:
              storeSSOInfo.national_holiday_reception_end_time,
            canIssueTerminalCertificate:
              storeSSOInfo.can_issue_terminal_certificate,
            useTerminalCertificate: storeSSOInfo.use_terminal_certificate,
            canEditSelfInfo: storeSSOInfo.can_edit_self_info,
            canManageStaff: storeSSOInfo.can_manage_staff,
            isPublic: storeSSOInfo.is_public,
            isBusinessSetting: storeSSOInfo.is_business_setting,
            existLogoImage: storeSSOInfo.exist_logo_image,
            existStoreImage: storeSSOInfo.exist_store_image,
            shopId: storeSSOInfo.shop_id,
            shopPass: storeSSOInfo.shop_pass,
            siteId: storeSSOInfo.site_id,
            sitePass: storeSSOInfo.site_pass,
            logoImage: storeSSOInfo.logo_image,
          },
          {
            transaction: t,
          },
        );
      }

      await t.commit();
      Logger.info(
        `SSO Successfully response staffId: '${lpSeller.id}', storeId: '${lpStore.id}'`,
      );
      return {
        sellerId: lpSeller.id,
        storeId: lpStore.id,
      };
    } catch (e) {
      Logger.error(`Failed to register SSO Staff and Store`);
      Logger.error(e);
      await t.rollback();
      throw e;
    }
  }

  private async getStaffInfo(staffAlias: string, accessToken: string) {
    Logger.info(`Start get sso staff info with staffAlias: '${staffAlias}'`);
    let config = {
      method: 'get',
      url: `${sso.url}/ec/staff/${staffAlias}`,
      headers: {
        'access-token': accessToken,
      },
    };
    const res = await axios.request<StaffInfo>(config);
    Logger.info(`Get staff info response status: '${res.status}'`);
    if (res.status === HttpStatusCode.Ok) {
      Logger.info(`Get staff info response data: '${res.data}'`);
      return res.data;
    }
    return null;
  }

  private async getStoreInfo(storeAlias: string, accessToken: string) {
    Logger.info(`Start get sso store info with storeAlias: '${storeAlias}'`);
    let config = {
      method: 'get',
      url: `${sso.url}/ec/store/${storeAlias}`,
      headers: {
        'access-token': accessToken,
      },
    };
    const res = await axios.request<StoreInfo>(config);
    Logger.info(`Get store info response status: '${res.status}'`);
    if (res.status === HttpStatusCode.Ok) {
      Logger.info(`Get store info response data: '${res.data}'`);
      return res.data;
    }
    return null;
  }
}
