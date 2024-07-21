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
  PENDING = 0,
  CONFIRMED = 1,
  SHIPPED = 2,
  DELIVERED = 3,
  CANCELLED = 4,
  RETURNED = 5,
  FAILED = 6,
  SUCESS = 7,
}

export enum PaymentSatus {
  PENDING = 0,
  AUTHORIZED = 1,
  PAID = 2,
  PARTIALLY_PAID = 3,
  FAILED = 4,
  REFUNDED = 5,
  CANCELLED = 6,
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
  CREDIT_CARD = 0,
  DEBIT_CARD = 1,
  BANK_TRANSFER = 2,
  PAYPAL = 3,
  CASH_ON_DELIVERY = 4,
  MOBILE_PAYMENT = 5,
  GIFT_CARD = 6,
}
