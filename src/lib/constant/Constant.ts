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
}

export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  SHIPPED = 2,
  DELIVERED = 3,
  CANCELLED = 4,
  RETURNED = 5,
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
