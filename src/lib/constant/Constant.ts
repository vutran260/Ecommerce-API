export const DATE_FORMAT = 'YYYY/MM/DD';

export enum DefaultFormat {
  DATE = 'YYYY-MM-DD',
  DATETIME = 'YYYY-MM-DD HH:mm:ss',
  TIME = 'HH:mm:ss',
  DATETIME_NO_SECONDS = 'YYYY-MM-DD HH:mm',
  TIME_NO_SECONDS = 'HH:mm',
  DATETIME_WITH_SECONDS = 'YYYY-MM-DD HH:mm:ss.SSS',
  DATETIMESECONDS_WITHOUT_CHAR = 'YYYYMMDDHHmmss',
  JP_DATE = 'YYYY年MM月DD日',
  JP_MONTH = 'YYYY年MM月',
  YEAR_MONTH_FORMAT = 'YYYY/MM',
  DATETIME_WITHOUT_SECONDS = 'YYYY/MM/DD HH:mm',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  FAILED = 'FAILED',
  SUCESS = 'SUCESS',
}

export enum PaymentSatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum JobCd {
  CHECK = 'CHECK',
  CAPTURE = 'CAPTURE',
  AUTH = 'AUTH',
  SAUTH = 'SAUTH',
}

export enum ChargeMethod {
  BULK = '1',
  INSTALLMENT = '2',
  BONUS = '3',
  REVOLVING = '5',
}

export enum TypeShift {
  CREATE_ORDER = '$create_order',
}

export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  GIFT_CARD = 'GIFT_CARD',
}

export enum ShipmentPrice {
  MAX_PRICE_APPY_FEE = 7000,
  MIN_FEE = 0,
  MAX_FEE = 500,
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const EXPIRED_SIGNED_URL = 15 * 60;
export const FOLDER_PREFIX = 'link-palette';
export const IMAGE_PREFIX = 'link-palette';
