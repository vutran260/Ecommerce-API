export class ExecTransactionResponse {
  acs: string;
  redirectUrl: string;
  accessId: string;
  accessPass: string;

  constructor(
    acs: string,
    redirectUrl: string,
    accessId: string,
    accessPass: string,
  ) {
    this.acs = acs;
    this.redirectUrl = redirectUrl;
    this.accessId = accessId;
    this.accessPass = accessPass;
  }
}
