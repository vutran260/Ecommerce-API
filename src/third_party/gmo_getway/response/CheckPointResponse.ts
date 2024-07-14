export class CheckPointResponse {
  memberID: string;
  memberName: string;
  siftOrderID: string;
  paymentAbuseScore: string;
  constructor(
    memberID: string,
    memberName: string,
    siftOrderID: string,
    paymentAbuseScore: string,
  ) {
    this.memberID = memberID;
    this.memberName = memberName;
    this.siftOrderID = siftOrderID;
    this.paymentAbuseScore = paymentAbuseScore;
  }
}
