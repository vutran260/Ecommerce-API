import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class ProductOption {
 
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