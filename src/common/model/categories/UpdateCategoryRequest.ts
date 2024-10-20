import { IsNumber, IsString, IsOptional } from 'class-validator';

export default class UpdateCategoryRequest {
  parentId?: string;
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
