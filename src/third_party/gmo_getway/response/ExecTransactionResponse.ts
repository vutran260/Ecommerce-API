export class ExecTransactionResponse {
  acs: string;
  redirectUrl: string;

  constructor(acs: string, redirectUrl: string) {
    this.acs = acs;
    this.redirectUrl = redirectUrl;
  }
}
