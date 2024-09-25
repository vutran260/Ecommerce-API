import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export default class UpdateCategoryRequest {
  id: string;
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsOptional()
  categoryName: string;

  @IsString()
  @IsOptional()
  categoryTag: string;

  @IsString()
  @IsOptional()
  categoryImage: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  orderLevel: number;
}
