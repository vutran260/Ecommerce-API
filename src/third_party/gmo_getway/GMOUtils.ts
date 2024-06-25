
// ErrorCode from GMO is string follow example:
//ErrCode=E01|E01&ErrInfo=E01390002|E01240002
export function hasError(response: string): boolean {
  return response.includes("ErrCode") && response.includes("ErrInfo");
}

export function getErrorInfo(response :string):string {
  const params = new URLSearchParams(response.replace(/\|/g, '&'));
  const errInfo = params.get('ErrInfo');

  return errInfo !== null ? errInfo :"" ;
}

export function convertToRecordString(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = String(obj[key]);
    }
  }
  return result;
}

export const GMO_ERROR_USER_NOT_EXIST   ="E01390002"