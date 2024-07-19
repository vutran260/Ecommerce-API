export class ExecTransactionRequest {
  accessID: string;
  accessPass: string;
  orderID: string;
  method: string;
  token: string;

  constructor(
    accessID: string,
    accessPass: string,
    orderID: string,
    method: string,
    token: string,
  ) {
    this.accessID = accessID;
    this.accessPass = accessPass;
    this.orderID = orderID;
    this.method = method;
    this.token = token;
  }
}
