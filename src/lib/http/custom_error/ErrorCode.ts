export enum ErrorCode {
  INTERNAL = '00001',

  UNAUTHORIZED = '10001',
  FORBIDDEN = '10002',

  NOT_FOUND = '20001',
  BAD_REQUEST = '20002',
  ALREADY_EXISTS = '20003',

  TOKEN_EXPIRED = '30001',
  OVER_STOCK = '40001'
}
