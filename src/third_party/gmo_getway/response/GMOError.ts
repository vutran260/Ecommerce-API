export class GMOError{

  errInfo :string;
  errCode:string;



  constructor(errInfo: string, errCode: string) {
    this.errInfo = errInfo;
    this.errCode = errCode;
  }

}