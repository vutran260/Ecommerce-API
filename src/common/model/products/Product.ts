import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import ProductComponent from './ProductCompoment';
import ProductOption from './ProductOption';
import ProductOptionPrice from './ProductOptionPrice';
import { LP_PRODUCTAttributes } from '../../../lib/mysql/models/LP_PRODUCT';
import { TINYINTToBoolean, booleanToTINYINT } from '../../../lib/helpers/utils';
import moment from 'moment';
import { DATE_FORMAT as DATE_FORMAT } from '../../../lib/constant/Constant';

export default class Product {
  id: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubscription: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDiscount: boolean;

  @IsArray()
  buyingPeriod?: number[];

  @IsBoolean()
  @IsNotEmpty()
  isRecommend: boolean;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsArray()
  @IsNotEmpty()
  productImage: string[];

  @IsString()
  @IsNotEmpty()
  productDescription: string;

  @IsString()
  capacity: string;

  @IsString()
  expirationUseDate: string;

  @IsString()
  storageMethod: string;

  @IsString()
  intakeMethod: string;

  @IsString()
  ingredient: string;

  @IsString()
  notificationNumber: string;

  @IsString()
  notification: string;

  @IsBoolean()
  @IsNotEmpty()
  hasOption: boolean;

  @IsString()
  productTag: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  price: number;

  priceSubscription?: number;

  cost: string;

  stockItem: number;

  @IsArray()
  components: ProductComponent[];

  @IsArray()
  options: ProductOption[];

  @IsArray()
  optionPrices: ProductOptionPrice[];

  @IsArray()
  categories: string[];


  discountPercentage?: number;

  hasDiscountSchedule?: boolean;

  discountTimeFrom?: string;

  discountTimeTo?: string;

  calculatedNormalPrice: number;

  calculatedSubscriptionPrice?: number;

}

export const ProductToLP_PRODUCT = (product: Product): LP_PRODUCTAttributes => {

  // const discountTimeFrom = this.discountTimeFrom ? moment(this.discountTimeFrom, DATE_FORMAT).toDate() : undefined;

  return {
    id: product.id,
    storeId: product.storeId,
    isSubscription: booleanToTINYINT(product.isSubscription)!,
    isDiscount: booleanToTINYINT(product.isDiscount)!,
    buyingPeriod: product.buyingPeriod?.join(','),
    isRecommend: booleanToTINYINT(product.isRecommend)!,
    productName: product.productName,
    productImage: product.productImage?.join(','),
    productDescription: product.productDescription,
    capacity: product.capacity,
    expirationUseDate: product.expirationUseDate,
    storageMethod: product.storageMethod,
    intakeMethod: product.intakeMethod,
    ingredient: product.ingredient,
    notificationNumber: product.notificationNumber,
    notification: product.notification,
    hasOption: booleanToTINYINT(product.hasOption)!,
    price: product.price,
    priceSubscription: product.priceSubscription,
    cost: parseFloat(product.cost),
    stockItem: product.stockItem,
    productTag: product.productTag,
    status: product.status,
    isDeleted: 0,

    discountPercentage: product.discountPercentage,
    hasDiscountSchedule: booleanToTINYINT(product.hasDiscountSchedule),
    discountTimeFrom: product.discountTimeFrom ? moment(product.discountTimeFrom, DATE_FORMAT).toDate() : undefined,
    discountTimeTo: product.discountTimeTo ? moment(product.discountTimeTo, DATE_FORMAT).toDate() : undefined,
  };
};

export const ProductFromLP_PRODUCT = (
  lpProduct: LP_PRODUCTAttributes,
): Product => {

  if (!lpProduct) {
    return new Product();
  }

  return {
    id: lpProduct.id,
    storeId: lpProduct.storeId,
    isSubscription: TINYINTToBoolean(lpProduct.isSubscription)!,
    isDiscount: TINYINTToBoolean(lpProduct.isDiscount)!,

    buyingPeriod: lpProduct.buyingPeriod
      ? lpProduct.buyingPeriod.split(',').map(Number)
      : [],
    isRecommend: TINYINTToBoolean(lpProduct.isRecommend)!,
    productName: lpProduct.productName,
    productImage: lpProduct.productImage ? lpProduct.productImage.split(',') : [],
    productDescription: lpProduct.productDescription,
    capacity: lpProduct.capacity ? lpProduct.capacity : '',
    expirationUseDate: lpProduct.expirationUseDate
      ? lpProduct.expirationUseDate
      : '',
    storageMethod: lpProduct.storageMethod ? lpProduct.storageMethod : '',
    intakeMethod: lpProduct.intakeMethod ? lpProduct.intakeMethod : '',
    ingredient: lpProduct.ingredient ? lpProduct.ingredient : '',
    notificationNumber: lpProduct.notificationNumber
      ? lpProduct.notificationNumber
      : '',
    notification: lpProduct.notification ? lpProduct.notification : '',
    hasOption: TINYINTToBoolean(lpProduct.hasOption)!,
    price: lpProduct.price,
    priceSubscription: lpProduct.priceSubscription,
    cost: lpProduct.cost ? lpProduct.cost.toString() : '0',
    stockItem: lpProduct.stockItem ? lpProduct.stockItem : 0,
    productTag: lpProduct.productTag ? lpProduct.productTag : '',
    status: lpProduct.status ? lpProduct.status : '',
    components: [],
    options: [],
    optionPrices: [],
    categories: [],
    discountPercentage: lpProduct.discountPercentage,
    hasDiscountSchedule: TINYINTToBoolean(lpProduct.hasDiscountSchedule),
    discountTimeFrom: moment(lpProduct.discountTimeFrom).format(DATE_FORMAT),
    discountTimeTo: moment(lpProduct.discountTimeTo).format(DATE_FORMAT),
    calculatedNormalPrice: calculatedProductNormalPrice(lpProduct),
    calculatedSubscriptionPrice: calculatedProductSubscriptionPrice(lpProduct),
  };
};


const calculatedProductNormalPrice = (LpProduct: LP_PRODUCTAttributes): number => {
  let price = LpProduct.price!;

  if (!LpProduct.isDiscount) {
    return price;
  }

  const now = new Date();
  if (!LpProduct.hasDiscountSchedule ||
    (LpProduct.hasDiscountSchedule && (
      now <= LpProduct.discountTimeTo! &&
      now >= LpProduct.discountTimeFrom!
    ))
  ) {
    price = Math.round((price * (100 - LpProduct.discountPercentage!)) / 100);
    return price;
  }
  return price
};

const calculatedProductSubscriptionPrice = (LpProduct: LP_PRODUCTAttributes): number | undefined => {
  if (!LpProduct.isSubscription) {
    return undefined;
  }
  let price = LpProduct.priceSubscription!;


  if (!LpProduct.isDiscount) {
    return price;
  }

  
  const now = moment(new Date()).format(DATE_FORMAT);
  const discountTimeFrom = moment(LpProduct.discountTimeFrom).format(DATE_FORMAT);
  const discountTimeTo = moment(LpProduct.discountTimeTo).format(DATE_FORMAT);
  if (!LpProduct.hasDiscountSchedule ||
    (LpProduct.hasDiscountSchedule && (
      now <= discountTimeFrom &&
      now >= discountTimeTo
    ))
  ) {
    price = Math.round((price * (100 - LpProduct.discountPercentage!)) / 100);
    return price;
  }
  return price
};