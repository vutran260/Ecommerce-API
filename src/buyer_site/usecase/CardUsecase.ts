import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { isEmpty } from 'lodash';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import Logger from '../../lib/core/Logger';


export class CardUsecase {

  private gmoPaymentService: GMOPaymentService;


  constructor(gmoPaymentService: GMOPaymentService) {
    this.gmoPaymentService = gmoPaymentService;
  }

  public getCards = async (userId: string) => {
    if (userId === undefined ||
      isEmpty(userId)) {
      throw new BadRequestError('user id must be not empty')
    }

    //TODO call to LINQ to get GMO member ID

    return this.gmoPaymentService.searchCard(userId);
  }

  public saveCards = async (userId: string, token: string) => {
    if (userId === undefined ||
      isEmpty(userId)) {
      throw new BadRequestError('user id must be not empty')
    }

    if (token === undefined ||
      isEmpty(token)) {
      throw new BadRequestError('card token must be not empty')
    }

    //TODO call to LINQ to get GMO member ID

    try {
      // check member id from GMO
      const getMemberResponse  = await this.gmoPaymentService.getMemberDetails(userId);

      if(isEmpty(getMemberResponse)){
        await  this.gmoPaymentService.registerMember(userId);
      }

      await this.gmoPaymentService.saveCard(userId, token);

      return await this.gmoPaymentService.searchCard(userId);
    } catch (error){
      Logger.error('Fail to save cards');
      Logger.error(error);
      throw  error;
    }

  }

}