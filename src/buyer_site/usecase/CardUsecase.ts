import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { isEmpty, isNull } from 'lodash';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import Logger from '../../lib/core/Logger';

export class CardUsecase {
  private gmoPaymentService: GMOPaymentService;

  constructor(gmoPaymentService: GMOPaymentService) {
    this.gmoPaymentService = gmoPaymentService;
  }

  public getCards = async (userId: string) => {
    if (userId === undefined || isEmpty(userId)) {
      throw new BadRequestError('user id must be not empty');
    }

    //TODO call to LINQ to get GMO member ID
    const getMemberResponse =
      await this.gmoPaymentService.getMemberById(userId);

    if (!isNull(getMemberResponse)) {
      return await this.gmoPaymentService.searchCard(userId);
    }

    return [];
  };

  public saveCards = async (userId: string, token: string) => {
    if (userId === undefined || isEmpty(userId)) {
      throw new BadRequestError('user id must be not empty');
    }

    if (token === undefined || isEmpty(token)) {
      throw new BadRequestError('card token must be not empty');
    }

    //TODO call to LINQ to get GMO member ID

    try {
      // check member id from GMO
      const getMemberResponse =
        await this.gmoPaymentService.getMemberById(userId);

      if (isNull(getMemberResponse)) {
        Logger.info('Member is not existed, register new member by user id');
        await this.gmoPaymentService.registerMember(userId);
      }

      const searchCardResponse =
        await this.gmoPaymentService.searchCard(userId);
      if (!isNull(searchCardResponse)) {
        Logger.info('Card is existed, can not add more');
        Logger.info(searchCardResponse);
        throw new BadRequestError('Can not add more than one card');
      }

      return await this.gmoPaymentService.saveCard(userId, token);
    } catch (error) {
      Logger.error('Fail to save cards');
      Logger.error(error);
      throw error;
    }
  };
}
