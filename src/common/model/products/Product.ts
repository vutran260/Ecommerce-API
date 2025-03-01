import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import ProductComponent from './ProductCompoment';
import { LP_PRODUCTAttributes } from '../../../lib/mysql/models/LP_PRODUCT';
import { TINYINTToBoolean, booleanToTINYINT } from '../../../lib/helpers/utils';
import moment from 'moment';
import { DATE_FORMAT as DATE_FORMAT } from '../../../lib/constant/Constant';
import { IsYYYYMMDD } from '../../custom_validator/IsYYYYMMDD';
import ProductFaq from '../../../common/model/products/ProductFaq';

export default class Product {
  id: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubscription: boolean;

  @IsBoolean()
  @IsOptional()
  isSpecial: boolean;

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
  @IsNotEmpty()
  productOverview: string;

  @IsString()
  productTag: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  price: number;

  priceSubscription?: number;

  cost: string;

  @IsNotEmpty()
  @IsNumber()
  stockItem: number;

  @IsArray()
  components: ProductComponent[];

  @IsArray()
  faqs: ProductFaq[];

  @IsArray()
  categories: string[];

  discountPercentage?: number;

  hasDiscountSchedule?: boolean;

  @IsYYYYMMDD()
  discountTimeFrom?: string;

  @IsYYYYMMDD()
  discountTimeTo?: string;

  calculatedNormalPrice: number;

  calculatedSubscriptionPrice?: number;

  isFavorite?: boolean;

  totalQuantityInCart?: number;

  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductToLP_PRODUCT = (product: Product): LP_PRODUCTAttributes => {
  // const discountTimeFrom = this.discountTimeFrom ? moment(this.discountTimeFrom, DATE_FORMAT).toDate() : undefined;

  return {
    id: product.id,
    storeId: product.storeId,
    isSpecial: booleanToTINYINT(product.isSpecial)!,
    isSubscription: booleanToTINYINT(product.isSubscription)!,
    isDiscount: booleanToTINYINT(product.isDiscount)!,
    buyingPeriod: product.buyingPeriod?.join(','),
    isRecommend: booleanToTINYINT(product.isRecommend)!,
    productName: product.productName,
    productImage: product.productImage?.join(','),
    productDescription: product.productDescription,
    productOverview: product.productOverview,
    price: product.price,
    priceSubscription: product.priceSubscription,
    cost: parseFloat(product.cost),
    stockItem: product.stockItem,
    productTag: product.productTag,
    status: product.status,
    isDeleted: 0,

    discountPercentage: product.discountPercentage,
    hasDiscountSchedule: booleanToTINYINT(product.hasDiscountSchedule),
    discountTimeFrom: product.discountTimeFrom
      ? moment(product.discountTimeFrom, DATE_FORMAT).toDate()
      : undefined,
    discountTimeTo: product.discountTimeTo
      ? moment(product.discountTimeTo, DATE_FORMAT).toDate()
      : undefined,
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
    isSpecial: TINYINTToBoolean(lpProduct.isSpecial)!,
    isSubscription: TINYINTToBoolean(lpProduct.isSubscription)!,
    isDiscount: TINYINTToBoolean(lpProduct.isDiscount)!,

    buyingPeriod: lpProduct.buyingPeriod
      ? lpProduct.buyingPeriod.split(',').map(Number)
      : [],
    isRecommend: TINYINTToBoolean(lpProduct.isRecommend)!,
    productName: lpProduct.productName,
    productImage: lpProduct.productImage
      ? lpProduct.productImage.split(',')
      : [],
    productDescription: lpProduct.productDescription,
    productOverview: lpProduct.productOverview,
    price: lpProduct.price,
    priceSubscription: lpProduct.priceSubscription,
    cost: lpProduct.cost ? lpProduct.cost.toString() : '0',
    stockItem: lpProduct.stockItem ? lpProduct.stockItem : 0,
    productTag: lpProduct.productTag ? lpProduct.productTag : '',
    status: lpProduct.status ? lpProduct.status : '',
    components: [],
    categories: [],
    faqs: [],
    discountPercentage: lpProduct.discountPercentage,
    hasDiscountSchedule: TINYINTToBoolean(lpProduct.hasDiscountSchedule),
    discountTimeFrom: !lpProduct.discountTimeFrom
      ? undefined
      : moment(lpProduct.discountTimeFrom).format(DATE_FORMAT),
    discountTimeTo: !lpProduct.discountTimeTo
      ? undefined
      : moment(lpProduct.discountTimeTo).format(DATE_FORMAT),
    calculatedNormalPrice: calculatedProductNormalPrice(lpProduct),
    calculatedSubscriptionPrice: calculatedProductSubscriptionPrice(lpProduct),
    isDeleted: lpProduct.isDeleted === 1,
    createdAt: lpProduct.createdAt,
    updatedAt: lpProduct.updatedAt,
  };
};

const calculatedProductNormalPrice = (
  LpProduct: LP_PRODUCTAttributes,
): number => {
  let price = LpProduct.price!;

  if (!LpProduct.isDiscount) {
    return price;
  }

  const now = moment(new Date()).format(DATE_FORMAT);
  const discountTimeFrom = moment(LpProduct.discountTimeFrom).format(
    DATE_FORMAT,
  );
  const discountTimeTo = moment(LpProduct.discountTimeTo).format(DATE_FORMAT);
  if (
    !LpProduct.hasDiscountSchedule ||
    (LpProduct.hasDiscountSchedule &&
      now >= discountTimeFrom &&
      now <= discountTimeTo)
  ) {
    price = Math.round((price * (100 - LpProduct.discountPercentage!)) / 100);
    return price;
  }
  return price;
};

const calculatedProductSubscriptionPrice = (
  LpProduct: LP_PRODUCTAttributes,
): number | undefined => {
  if (!LpProduct.isSubscription) {
    return undefined;
  }
  let price = LpProduct.priceSubscription!;

  if (!LpProduct.isDiscount) {
    return price;
  }

  const now = moment(new Date()).format(DATE_FORMAT);
  const discountTimeFrom = moment(LpProduct.discountTimeFrom).format(
    DATE_FORMAT,
  );
  const discountTimeTo = moment(LpProduct.discountTimeTo).format(DATE_FORMAT);
  if (
    !LpProduct.hasDiscountSchedule ||
    (LpProduct.hasDiscountSchedule &&
      now >= discountTimeFrom &&
      now <= discountTimeTo)
  ) {
    price = Math.round((price * (100 - LpProduct.discountPercentage!)) / 100);
    return price;
  }
  return price;
};
