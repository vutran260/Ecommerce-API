import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { isEmpty, isNull } from 'lodash';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import Logger from '../../lib/core/Logger';
import { SearchCardResponse } from '../../third_party/gmo_getway/response/SearchCardResponse';


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

    const result: any[]=[];

    //TODO call to LINQ to get GMO member ID
    const getMemberResponse  = await this.gmoPaymentService.getMemberById(userId);

    if(!isNull(getMemberResponse)){
      Logger.info("Member is existed, search card")
      const card  = await this.gmoPaymentService.searchCard(userId, "0");
      if (card!== null ){
        result.push(card);
      }
    }

    return  result;
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
      const getMemberResponse  = await this.gmoPaymentService.getMemberById(userId);

      if(isNull(getMemberResponse)){
        Logger.info("Member is not existed, register new member by user id")
        await  this.gmoPaymentService.registerMember(userId);
      }

      await this.gmoPaymentService.saveCard(userId, token);

      return await this.gmoPaymentService.searchCard(userId,"0");
    } catch (error){
      Logger.error('Fail to save cards');
      Logger.error(error);
      throw  error;
    }

  }

}