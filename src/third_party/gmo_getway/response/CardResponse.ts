export class CardResponse {
  cardSeq: string;
  cardNo: string;
  expire: string;
  defaultFlag: string;
  cardName: string;
  holderName: string;
  deleteFlag: string;
  brand: string;
  domesticFlag: string;
  issuerCode: string;
  debitPrepaidFlag: string;
  debitPrepaidIssuerName: string;
  forwardFinal: string;

  constructor(
    cardSeq: string,
    cardNo: string,
    expire: string,
    defaultFlag: string,
    cardName: string,
    holderName: string,
    deleteFlag: string,
    brand: string,
    domesticFlag: string,
    issuerCode: string,
    debitPrepaidFlag: string,
    debitPrepaidIssuerName: string,
    forwardFinal: string,
  ) {
    this.cardSeq = cardSeq;
    this.cardNo = cardNo;
    this.expire = expire;
    this.defaultFlag = defaultFlag;
    this.cardName = cardName;
    this.holderName = holderName;
    this.deleteFlag = deleteFlag;
    this.brand = brand;
    this.domesticFlag = domesticFlag;
    this.issuerCode = issuerCode;
    this.debitPrepaidFlag = debitPrepaidFlag;
    this.debitPrepaidIssuerName = debitPrepaidIssuerName;
    this.forwardFinal = forwardFinal;
  }
}
