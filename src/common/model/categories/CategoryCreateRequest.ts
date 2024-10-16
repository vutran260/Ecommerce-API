import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CategoryCreateRequest {
  id?: string;
  parentId?: string;

  storeId: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  categoryTag: string;

  @IsString()
  @IsNotEmpty()
  categoryImage: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  orderLevel: number;
}
