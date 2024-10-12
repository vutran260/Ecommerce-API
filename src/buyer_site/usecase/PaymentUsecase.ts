import { ChargeMethod, JobCd } from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { TransactionRequest } from '../../third_party/gmo_getway/request/EntryTransactionRequest';
import { ExecTransactionRequest } from '../../third_party/gmo_getway/request/ExecTransactionRequest';
import { LP_ORDER, LP_ORDERAttributes } from '../../lib/mysql/models/LP_ORDER';
import { isEmpty } from 'lodash';
import { CardUsecase } from '../../buyer_site/usecase/CardUsecase';

export class PaymentUseCase {
  private gmoPaymentService: GMOPaymentService;
  private cardUseCase: CardUsecase;

  constructor(gmoPaymentService: GMOPaymentService, cardUseCase: CardUsecase) {
    this.gmoPaymentService = gmoPaymentService;
    this.cardUseCase = cardUseCase;
  }

  public async processTransaction(params: {
    order: LP_ORDERAttributes;
    cardSeq?: string;
  }) {
    let { order, cardSeq } = params;
    const finalAmount = order.totalAmount;
    const orderId = order.id;
    const buyerId = order.buyerId || '';

    if (!cardSeq) {
      const cards = await this.cardUseCase.getCards(buyerId);
      if (!cards || isEmpty(cards)) {
        Logger.error(`Buyer id ${order.buyerId} has no card yet!`);
        return;
      }
      cardSeq = cards[0].cardSeq;
    }

    if (finalAmount <= 0) {
      Logger.error('Bad total amount');
      throw new BadRequestError('Your total amount must be greater than 0');
    }

    Logger.info('Start create transaction');
    const transactionRequest: TransactionRequest = {
      orderID: `${orderId}`,
      jobCd: JobCd.CAPTURE,
      amount: finalAmount,
    };

    const theTransInfo =
      await this.gmoPaymentService.entryTran(transactionRequest);
    Logger.info(theTransInfo);

    Logger.info('Start execute transaction');
    if (theTransInfo) {
      const execTransactionRequest: ExecTransactionRequest = {
        accessID: theTransInfo.accessID,
        accessPass: theTransInfo.accessPass,
        memberID: buyerId,
        cardSeq: cardSeq,
        orderID: `${orderId}`,
        method: ChargeMethod.BULK,
      };

      return await this.gmoPaymentService.execTran(execTransactionRequest);
    }
    return null;
  }

  public cancelTran = async (order: LP_ORDER) => {
    return this.gmoPaymentService.cancelTran(order);
  };

  public checkFraud = async (type: string, userId: string) => {
    return this.gmoPaymentService.checkFraud(type, userId);
  };

  public entryTran = async (transactionRequest: TransactionRequest) => {
    return await this.gmoPaymentService.entryTran(transactionRequest);
  };

  public execTran = async (
    preExecTransactionRequest: ExecTransactionRequest,
  ) => {
    return await this.gmoPaymentService.execTran(preExecTransactionRequest);
  };
}
