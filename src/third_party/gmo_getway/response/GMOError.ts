export class GMOError{

  errInfo :string;
  errCode:string;

  constructor(response :string) {
    const params = new URLSearchParams(response);

    const errorInfo = params.get('ErrInfo') || '';
    const errCode = params.get('ErrCode') || '';
    this.errInfo = errorInfo;
    this.errCode = errCode;
  }
}