export class CheckPointResponse {
  siftOrderID: string;
  paymentAbuseScore: string;
  constructor(siftOrderID: string, paymentAbuseScore: string) {
    this.siftOrderID = siftOrderID;
    this.paymentAbuseScore = paymentAbuseScore;
  }
}
