import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { LP_PRODUCT_OPTION_PRICEAttributes } from "../../../lib/mysql/models/LP_PRODUCT_OPTION_PRICE";


export default class ProductOptionPrice {
  productId: string;

  @IsString()
  optionValue1: string;

  @IsString()
  optionValue2: string;

  @IsString()
  optionValue3: string;

  @IsNumberString()
  @IsNotEmpty()
  price: string;
  
  @IsNumberString()
  @IsNotEmpty()
  priceBeforeDiscount: string;

  @IsNumberString()
  @IsNotEmpty()
  cost: string;


  @IsNumber()
  @IsNotEmpty()
  stockItem: number;
}

export const ProductOptionPriceFromLP_PRODUCT_OPTION_PRICE = (price: LP_PRODUCT_OPTION_PRICEAttributes): ProductOptionPrice => {
  return {
    productId: price.productId,
    optionValue1: price.optionValue1,
    optionValue2: price.optionValue2,
    optionValue3: price.optionValue3,
    price: price.price.toString(),
    priceBeforeDiscount: price.priceBeforeDiscount?price.priceBeforeDiscount.toString():'0',
    cost: price.cost.toString(),
    stockItem: price.stockItem
  }
}

export const ProductOptionPriceToLP_PRODUCT_OPTION_PRICE = (price: ProductOptionPrice): LP_PRODUCT_OPTION_PRICEAttributes => {
  return {
    productId: price.productId,
    optionValue1: price.optionValue1,
    optionValue2: price.optionValue2,
    optionValue3: price.optionValue3,
    price: Number(price.price),
    priceBeforeDiscount: Number(price.priceBeforeDiscount),
    cost: Number(price.cost),
    stockItem: price.stockItem
  }
}
