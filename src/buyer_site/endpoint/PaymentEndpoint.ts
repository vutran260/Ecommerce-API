import express, { Response } from 'express';
import { ResponseData } from '../../lib/http/Response';
import { ProtectedRequest } from '../../lib/http/app-request';
import { PaymentUseCase } from '../usecase/PaymentUsecase';

export class PaymentEndpoint {
  private paymentUseCase: PaymentUseCase;

  constructor(paymentUseCase: PaymentUseCase) {
    this.paymentUseCase = paymentUseCase;
  }

  // API testing check point on server SIFT
  private checkFraud = async (req: ProtectedRequest, res: Response) => {
    const results = await this.paymentUseCase.checkFraud(
      req.body.type,
      req.body.userId,
    );
    return ResponseData(results, res);
  };

  // API testing create transaction for payment on GMO
  private entryTran = async (req: ProtectedRequest, res: Response) => {
    const transactionRequest = {
      orderID: req.body.orderID,
      jobCd: req.body.jobCd,
      amount: req.body.amount,
      tax: req.body.tax,
    };

    const results = await this.paymentUseCase.entryTran(transactionRequest);
    return ResponseData(results, res);
  };

  // API testing excecute transaction for payment on GMO
  private execTran = async (req: ProtectedRequest, res: Response) => {
    const transactionExecRequest = {
      accessID: req.body.accessID,
      accessPass: req.body.accessPass,
      memberID: req.body.memberID,
      cardSeq: req.body.cardSeq,
      orderID: req.body.orderID,
      method: req.body.method,
    };

    const results = await this.paymentUseCase.execTran(transactionExecRequest);
    return ResponseData(results, res);
  };

  public getRouter() {
    const router = express.Router();
    router.post('/test/fraud', this.checkFraud);
    router.post('/test/entry', this.entryTran);
    router.post('/test/exec', this.execTran);
    return router;
  }
}
