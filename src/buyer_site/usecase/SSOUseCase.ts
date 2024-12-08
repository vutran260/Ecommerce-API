import axios, { HttpStatusCode } from 'axios';
import { UserInfo } from '../../common/model/sso/UserInfo';
import { LP_ADDRESS_BUYER_SSO } from '../../lib/mysql/models/LP_ADDRESS_BUYER_SSO';
import { LP_BUYER } from '../../lib/mysql/models/LP_BUYER';
import { LP_BUYER_PERSONAL_INFORMATION } from '../../lib/mysql/models/LP_BUYER_PERSONAL_INFORMATION';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_STORE } from '../../lib/mysql/models/LP_STORE';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import { sso } from '../../Config';
import Logger from '../../lib/core/Logger';

export class SSOUseCase {
  public async registerSSOUser(
    accessToken: string,
    userAlias: string,
    storeAlias: string,
  ) {
    Logger.info(
      `Register sso user with userAlias: ${userAlias}, storeAlias: ${storeAlias}`,
    );
    const lpStore = await LP_STORE.findOne({
      where: {
        id: storeAlias,
        status: 'true',
      },
    });

    if (!lpStore) {
      throw new InternalError(`Store with id '${storeAlias}' not found.`);
    }

    const userSSOInfo = await this.getUserInfo(userAlias, accessToken);
    if (!userSSOInfo) {
      throw new InternalError(
        `SSO user with userAlias: '${userAlias}' not found.`,
      );
    }

    const lpBuyer = await LP_BUYER.findByPk(userSSOInfo.user_alias);
    if (lpBuyer) {
      Logger.info(`UserAlias: '${userAlias}' already registered in DB`);
      Logger.info(
        `SSO Successfully response buyerId: '${lpBuyer.id}', storeId: '${lpStore.id}'`,
      );
      return {
        buyerId: lpBuyer.id,
        storeId: lpStore.id,
      };
    }

    const t = await lpSequelize.transaction();
    try {
      const lpBuyer = await LP_BUYER.create(
        {
          id: userSSOInfo.user_alias,
          username: userSSOInfo.nickname,
          fullname:
            (userSSOInfo.last_name || '') + (userSSOInfo.first_name || ''),
        },
        {
          transaction: t,
        },
      );
      await LP_ADDRESS_BUYER_SSO.create(
        {
          buyerId: lpBuyer.id,
          email: userSSOInfo.email,
          telephoneNumber: userSSOInfo.phone_number || '',
          contactTelephoneNumber: userSSOInfo.contact_phone_number || '',
          postCode: userSSOInfo.postal_code || '',
          prefectureCode: userSSOInfo.prefecture_code || '',
          cityTown: userSSOInfo.address_city || '',
          buildingName: userSSOInfo.address_building || '',
        },
        {
          transaction: t,
        },
      );
      await LP_BUYER_PERSONAL_INFORMATION.create(
        {
          buyerId: lpBuyer.id,
          nickname: userSSOInfo.nickname || '',
          firstName: userSSOInfo.first_name || '',
          lastName: userSSOInfo.last_name || '',
          firstNameKana: userSSOInfo.first_name_kana || '',
          lastNameKana: userSSOInfo.last_name_kana || '',
          prefectureCode: userSSOInfo.prefecture_code || '',
          gender: userSSOInfo.gender || 0,
          birthday: userSSOInfo.birthday || '',
          age: userSSOInfo.age ? String(userSSOInfo.age) : undefined,
        },
        {
          transaction: t,
        },
      );

      await t.commit();
      Logger.info(
        `SSO Successfully response buyerId: '${lpBuyer.id}', storeId: '${lpStore.id}'`,
      );
      return {
        buyerId: lpBuyer.id,
        storeId: lpStore.id,
      };
    } catch (e) {
      Logger.error(`Failed to register SSO User`);
      Logger.error(e);
      await t.rollback();
      throw e;
    }
  }

  private async getUserInfo(userAlias: string, accessToken: string) {
    Logger.info(`Start get sso user info with userAlias: '${userAlias}'`);
    let config = {
      method: 'get',
      url: `${sso.url}/ec/user/${userAlias}`,
      headers: {
        'access-token': accessToken,
      },
    };
    const res = await axios.request<UserInfo>(config);
    Logger.info(`Get user info response status: '${res.status}'`);
    if (res.status === HttpStatusCode.Ok) {
      Logger.info(`Get user info response data: '${res.data}'`);
      return res.data;
    }
    return null;
  }
}
