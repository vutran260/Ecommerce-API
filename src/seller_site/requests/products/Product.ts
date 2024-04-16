import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import ProductComponent from './ProductCompoment';
import ProductOption from './ProductOption';
import ProductOptionPrice from './ProductOptionPrice';
import { LP_PRODUCTAttributes } from '../../../lib/mysql/models/LP_PRODUCT';
import { TINYINTToBoolean, booleanToTINYINT } from '../../../lib/helpers/utils';
import { LP_PRODUCT_COMPONENTAttributes } from '../../../lib/mysql/models/LP_PRODUCT_COMPONENT';

export default class Product {
  id: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubscription: boolean;

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

  priceBeforeDiscount: string;

  cost: string;

  stockItem: number;

  @IsArray()
  components: ProductComponent[];

  @IsArray()
  options: ProductOption[];

  @IsArray()
  optionPrices: ProductOptionPrice[];
}

export const ProductToLP_PRODUCT = (product: Product): LP_PRODUCTAttributes => {
  return {
    id: product.id,
    storeId: product.storeId,
    isSubscription: booleanToTINYINT(product.isSubscription),
    buyingTimeOption: product.buyingTimeOption?.join(','),
    buyingPeriod: product.buyingPeriod?.join(','),
    isRecomend: booleanToTINYINT(product.isRecomend),
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
    hasOption: booleanToTINYINT(product.hasOption),
    price: parseFloat(product.price),
    priceBeforeDiscount: parseFloat(product.priceBeforeDiscount),
    cost: parseFloat(product.cost),
    stockItem: product.stockItem,
    productTag: product.productTag,
    status: product.status,
  };
};

export const ProductFromLP_PRODUCT = (
  product: LP_PRODUCTAttributes,
): Product => {
  return {
    id: product.id,
    storeId: product.storeId,
    isSubscription: TINYINTToBoolean(product.isSubscription),
    buyingTimeOption: product.buyingTimeOption
      ? product.buyingTimeOption.split(',').map(Number)
      : [],
    buyingPeriod: product.buyingPeriod
      ? product.buyingPeriod.split(',').map(Number)
      : [],
    isRecomend: TINYINTToBoolean(product.isRecomend),
    productName: product.productName,
    productImage: product.productImage ? product.productImage.split(',') : [],
    productDescription: product.productDescription,
    capacity: product.capacity ? product.capacity : '',
    expirationUseDate: product.expirationUseDate
      ? product.expirationUseDate
      : '',
    storageMethod: product.storageMethod ? product.storageMethod : '',
    intakeMethod: product.intakeMethod ? product.intakeMethod : '',
    ingredient: product.ingredient ? product.ingredient : '',
    notificationNumber: product.notificationNumber
      ? product.notificationNumber
      : '',
    notification: product.notification ? product.notification : '',
    hasOption: TINYINTToBoolean(product.hasOption),
    price: product.price ? product.price.toString() : '0',
    priceBeforeDiscount: product.priceBeforeDiscount
      ? product.priceBeforeDiscount.toString()
      : '0',
    cost: product.cost ? product.cost.toString() : '0',
    stockItem: product.stockItem ? product.stockItem : 0,
    productTag: product.productTag ? product.productTag : '',
    status: product.status ? product.status : '',
    components: [],
    options: [],
    optionPrices: [],
  };
};
