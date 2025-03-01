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

export enum OrderType {
  NORMAL = 'NORMAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SPECIAL = 'SPECIAL',
}

export enum OrderStatus {
  WAITING_APPROVE = 'WAITING_APPROVE', //承認待ち
  APPROVED = 'APPROVED', // 承認済み
  REJECTED = 'REJECTED', // 拒否済み
  WAITING_CONFIRMED = 'WAITING_CONFIRMED', //受注確認待ち中
  CONFIRMED_ORDER = 'CONFIRMED_ORDER', // 受注確認済
  DELIVERING = 'DELIVERING', // 配達中
  DELIVERED = 'DELIVERED', // 配達完了
  CANCEL = 'CANCEL', // キャンセル
  SKIPPED = 'SKIPPED', // スキップ
}

export enum OrderRegularStatus {
  WAITING_CONFIRMED = 'WAITING_CONFIRMED', //受注確認待ち中
  CONFIRMED_ORDER = 'CONFIRMED_ORDER', // 受注確認済
  DELIVERING = 'DELIVERING', // 配達中
  DELIVERED = 'DELIVERED', // 配達完了
  CANCEL = 'CANCEL', // キャンセル
  SKIPPED = 'SKIPPED', // SKIPPED
}

export enum SubscriptionStatus {
  NEW = 'NEW', // 新規作成
  CONTINUE = 'CONTINUE', // 継続中
  CANCELLED = 'CANCELLED', // 解約済み
}

export enum PaymentSatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
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

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const EXPIRED_SIGNED_URL = 15 * 60;
export const SELLER_FOLDER_PREFIX = 'link-palette-seller';
export const BUYER_FOLDER_PREFIX = 'link-palette-buyer';
