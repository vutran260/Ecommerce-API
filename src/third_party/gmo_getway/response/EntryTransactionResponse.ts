export class EntryTransactionResponse {
  accessID: string;
  accessPass: string;

  constructor(accessID: string, accessPass: string) {
    this.accessID = accessID;
    this.accessPass = accessPass;
  }
}
