export class CheckPointRequest {
  shopID: string;
  shopPass: string;
  type: string;
  userID: string;

  constructor(shopID: string, shopPass: string, type: string, userID: string) {
    this.shopID = shopID;
    this.shopPass = shopPass;
    this.type = type;
    this.userID = userID;
  }
}
