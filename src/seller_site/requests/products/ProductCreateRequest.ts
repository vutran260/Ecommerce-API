import { IsNotEmpty, IsString } from "class-validator";

export default class ProductCreateRequest {

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productTag: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

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