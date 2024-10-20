import {
  LP_ADDRESS_BUYER,
  LP_SUBSCRIPTION,
  LP_SUBSCRIPTION_ADDRESS,
  LP_SUBSCRIPTION_ORDER,
  LP_SUBSCRIPTION_PRODUCT,
} from '../../../lib/mysql/models/init-models';
import Product, {
  ProductFromLP_PRODUCT,
} from '../../../common/model/products/Product';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsYYYYMMDD } from '../../custom_validator/IsYYYYMMDD';
import { IsHHMM } from '../../custom_validator/IsHHMM';
import { SubscriptionStatus } from '../../../lib/constant/Constant';
import { Type } from 'class-transformer';

export class CreateSubscriptionRequest {
  buyerId: string;
  storeId: string;
  startDate: Date;
  nextDate: Date;
  planDeliveryTimeFrom?: string;
  planDeliveryTimeTo?: string;
  subscriptionPeriod: number;
  subscriptionStatus: string;

  constructor(lpSubscription: LP_SUBSCRIPTION) {
    this.buyerId = lpSubscription.buyerId;
    this.storeId = lpSubscription.storeId;
    this.startDate = lpSubscription.startDate;
    this.nextDate = lpSubscription.nextDate;
    this.planDeliveryTimeFrom = lpSubscription.planDeliveryTimeFrom;
    this.planDeliveryTimeTo = lpSubscription.planDeliveryTimeTo;
    this.subscriptionPeriod = lpSubscription.subscriptionPeriod;
    this.subscriptionStatus = lpSubscription.subscriptionStatus;
  }
}

export class CreateSubscriptionProductRequest {
  subscriptionId: string;
  productId: string;
  quantity: number;

  constructor(lpSubscriptionProduct: LP_SUBSCRIPTION_PRODUCT) {
    this.subscriptionId = lpSubscriptionProduct.subscriptionId;
    this.productId = lpSubscriptionProduct.productId;
    this.quantity = lpSubscriptionProduct.quantity;
  }
}

export class CreateSubscriptionAddressRequest {
  subscriptionId: string;
  firstNameKana: string;
  lastNameKana: string;
  firstNameKanji: string;
  lastNameKanji: string;
  gender?: number;
  prefectureCode: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;

  constructor(lpAddressBuyer: LP_ADDRESS_BUYER) {
    this.firstNameKana = lpAddressBuyer.firstNameKana;
    this.lastNameKana = lpAddressBuyer.lastNameKana;
    this.firstNameKanji = lpAddressBuyer.firstNameKanji;
    this.lastNameKanji = lpAddressBuyer.lastNameKanji;
    this.gender = lpAddressBuyer.gender;
    this.prefectureCode = lpAddressBuyer.prefectureCode;
    this.postCode = lpAddressBuyer.postCode;
    this.cityTown = lpAddressBuyer.cityTown;
    this.streetAddress = lpAddressBuyer.streetAddress;
    this.buildingName = lpAddressBuyer.buildingName;
    this.email = lpAddressBuyer.email;
    this.telephoneNumber = lpAddressBuyer.telephoneNumber;
  }
}

export class CreateSubscriptionOrderRequest {
  subscriptionId: string;
  orderId: number;

  constructor(lpSubscriptionOrder: LP_SUBSCRIPTION_ORDER) {
    this.subscriptionId = lpSubscriptionOrder.subscriptionId;
    this.orderId = lpSubscriptionOrder.orderId;
  }
}

export class SubscriptionProduct {
  subscriptionId: string;
  productId: string;
  quantity: number;
  product: Product;

  static FromLP_SUBSCRIPTION_PRODUCT(
    lpSubscriptionProduct: LP_SUBSCRIPTION_PRODUCT,
  ) {
    const item = new SubscriptionProduct();
    item.subscriptionId = lpSubscriptionProduct.subscriptionId;
    item.productId = lpSubscriptionProduct.productId;
    item.quantity = lpSubscriptionProduct.quantity;
    item.product = ProductFromLP_PRODUCT(lpSubscriptionProduct.product);
    return item;
  }
}

export class SubscriptionAddress {
  subscriptionId: string;
  firstNameKana: string;
  lastNameKana: string;
  firstNameKanji: string;
  lastNameKanji: string;
  gender?: number;
  prefectureCode: string;
  prefectureName: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
  static FromLP_SUBSCRIPTION_ADDRESS(
    lpSubscriptionAddress: LP_SUBSCRIPTION_ADDRESS,
  ): SubscriptionAddress {
    const item = new SubscriptionAddress();
    item.subscriptionId = lpSubscriptionAddress.subscriptionId;
    item.firstNameKana = lpSubscriptionAddress.firstNameKana;
    item.lastNameKana = lpSubscriptionAddress.lastNameKana;
    item.firstNameKanji = lpSubscriptionAddress.firstNameKanji;
    item.lastNameKanji = lpSubscriptionAddress.lastNameKanji;
    item.gender = lpSubscriptionAddress.gender;
    item.prefectureCode = lpSubscriptionAddress.prefectureCode;
    item.prefectureName = lpSubscriptionAddress.prefectureName || '';
    item.postCode = lpSubscriptionAddress.postCode;
    item.cityTown = lpSubscriptionAddress.cityTown;
    item.streetAddress = lpSubscriptionAddress.streetAddress;
    item.buildingName = lpSubscriptionAddress.buildingName;
    item.email = lpSubscriptionAddress.email;
    item.telephoneNumber = lpSubscriptionAddress.telephoneNumber;
    return item;
  }
}

export class Subscription {
  id: string;

  @IsString()
  buyerId: string;

  @IsString()
  storeId: string;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscriptionStatus: string;

  @IsOptional()
  @IsNumber()
  subscriptionPeriod: number;

  @IsOptional()
  @IsYYYYMMDD()
  nextDate: string;

  @IsOptional()
  @IsHHMM()
  planDeliveryTimeFrom?: string;

  @IsOptional()
  @IsHHMM()
  planDeliveryTimeTo?: string;
}

export class ProductItem {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateProductItemsRequest {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductItem)
  items: ProductItem[];
}

export class UpdateProductSingleItemsRequest {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  newProductId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateProductSingleItemsRequest {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
