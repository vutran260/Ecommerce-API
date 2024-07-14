export class CheckPointRequest {
  shopID: string;
  shopPass: string;
  type: string;
  memberID: string;

  constructor(
    shopID: string,
    shopPass: string,
    type: string,
    memberID: string,
  ) {
    this.shopID = shopID;
    this.shopPass = shopPass;
    this.type = type;
    this.memberID = memberID;
  }
}
