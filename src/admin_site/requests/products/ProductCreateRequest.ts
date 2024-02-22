import { IsNotEmpty, IsString } from "class-validator";

export default class ProductCreateRequest {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  product_tag: string;

  @IsString()
  @IsNotEmpty()
  product_type: string;

  @IsString()
  @IsNotEmpty()
  stock: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}