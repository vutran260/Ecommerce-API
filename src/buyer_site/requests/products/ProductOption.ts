import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LP_PRODUCT_OPTIONAttributes } from "../../../lib/mysql/models/LP_PRODUCT_OPTION";

export default class ProductOption {
  productId: string;
 
  @IsNotEmpty()
  @IsString()
  optionType: string;
  
  @IsNotEmpty()
  @IsArray()
  optionValue: string[];

  @IsNotEmpty()
  @IsNumber()
  order: number;
}

export const ProductOptionFromLP_PRODUCT_OPTION = (option: LP_PRODUCT_OPTIONAttributes): ProductOption => {
  return {
    productId: option.productId,
    optionType: option.optionType,
    optionValue: option.optionValue.split(','),
    order: option.optionOrder
  }
}

export const ProductOptionToLP_PRODUCT_OPTION = (option: ProductOption): LP_PRODUCT_OPTIONAttributes => {
  return {
    productId: option.productId,
    optionType: option.optionType,
    optionValue: option.optionValue.join(','),
    optionOrder: option.order
  }
}