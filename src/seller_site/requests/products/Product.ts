import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import ProductComponent from './ProductCompoment';
import ProductOption from './ProductOption';
import ProductOptionPrice from './ProductOptionPrice';
import { LP_PRODUCTAttributes } from '../../../lib/mysql/models/LP_PRODUCT';
import { TINYINTToBoolean, booleanToTINYINT } from '../../../lib/helpers/utils';

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
  buyingTimeOption?: number[];

  @IsArray()
  buyingPeriod?: number[];

  @IsBoolean()
  @IsNotEmpty()
  isRecomend: boolean;

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
  capacity: string;

  @IsNotEmpty()
  @IsString()
  expirationUseDate: string;

  @IsString()
  @IsNotEmpty()
  storageMethod: string;

  @IsString()
  @IsNotEmpty()
  intakeMethod: string;

  @IsString()
  @IsNotEmpty()
  ingredient: string;

  @IsString()
  @IsNotEmpty()
  notificationNumber: string;

  @IsString()
  @IsNotEmpty()
  notification: string;

  @IsBoolean()
  @IsNotEmpty()
  hasOption: boolean;

  @IsString()
  @IsNotEmpty()
  productTag: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  price: string;

  priceSubscription: string;

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

  hasDiscountSchedule?:boolean;

  discountTimeFrom?: string;

  discountTimeTo?: string

}

export const ProductToLP_PRODUCT = (product: Product): LP_PRODUCTAttributes => {
  return {
    id: product.id,
    storeId: product.storeId,
    isSubscription: booleanToTINYINT(product.isSubscription)!,
    isDiscount: booleanToTINYINT(product.isDiscount)!,
    buyingTimeOption: product.buyingTimeOption?.join(','),
    buyingPeriod: product.buyingPeriod?.join(','),
    isRecomend: booleanToTINYINT(product.isRecomend)!,
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
    price: parseFloat(product.price),
    priceSubscription: parseFloat(product.priceSubscription),
    cost: parseFloat(product.cost),
    stockItem: product.stockItem,
    productTag: product.productTag,
    status: product.status,
    isDeleted: 0,

    discountPercentage: product.discountPercentage,
    hasDiscountSchedule: booleanToTINYINT(product.hasDiscountSchedule), 
    discountTimeFrom: product.discountTimeFrom?new Date(product.discountTimeFrom):undefined, 
    discountTimeTo: product.discountTimeTo?new Date(product.discountTimeTo):undefined,
  };
};

export const ProductFromLP_PRODUCT = (
  lpProduct: LP_PRODUCTAttributes,
): Product => {
  return {
    id: lpProduct.id,
    storeId: lpProduct.storeId,
    isSubscription: TINYINTToBoolean(lpProduct.isSubscription)!,
    isDiscount: TINYINTToBoolean(lpProduct.isDiscount)!,
    buyingTimeOption: lpProduct.buyingTimeOption
      ? lpProduct.buyingTimeOption.split(',').map(Number)
      : [],
    buyingPeriod: lpProduct.buyingPeriod
      ? lpProduct.buyingPeriod.split(',').map(Number)
      : [],
    isRecomend: TINYINTToBoolean(lpProduct.isRecomend)!,
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
    price: lpProduct.price ? lpProduct.price.toString() : '0',
    priceSubscription: lpProduct.priceSubscription
      ? lpProduct.priceSubscription.toString()
      : '0',
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
    discountTimeFrom: lpProduct.discountTimeFrom?.toISOString(), 
    discountTimeTo: lpProduct.discountTimeTo?.toISOString(),

  };
};
