export class PreExecTransactionRequest {
  siteID: string;
  sitePass: string;
  accessID: string;
  accessPass: string;
  memberID: string;
  cardSeq: string;
  orderID: string;
  method: string;

  constructor(
    siteID: string,
    sitePass: string,
    accessID: string,
    accessPass: string,
    memberID: string,
    cardSeq: string,
    orderID: string,
    method: string,
  ) {
    this.siteID = siteID;
    this.sitePass = sitePass;
    this.accessID = accessID;
    this.accessPass = accessPass;
    this.memberID = memberID;
    this.cardSeq = cardSeq;
    this.orderID = orderID;
    this.method = method;
  }
}

export class ExecTransactionRequest {
  accessID: string;
  accessPass: string;
  memberID: string;
  cardSeq: string;
  orderID: string;
  method: string;
}
