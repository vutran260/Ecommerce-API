export class EntryTransactionRequest {
  shopID: string;
  shopPass: string;
  orderID: string;
  jobCd: string;
  amount: number;

  constructor(
    shopID: string,
    shopPass: string,
    orderID: string,
    jobCd: string,
    amount: number,
  ) {
    this.shopID = shopID;
    this.shopPass = shopPass;
    this.orderID = orderID;
    this.jobCd = jobCd;
    this.amount = amount;
  }
}

export class TransactionRequest {
  orderID: string;
  jobCd: string;
  amount: number;
}
