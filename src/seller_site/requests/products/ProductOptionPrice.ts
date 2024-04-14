import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";


export default class ProductOptionPrice {


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

