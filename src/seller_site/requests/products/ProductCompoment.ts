import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export default class ProductComponent {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  
  @IsString()
  @IsNotEmpty()
  unit: string;
}