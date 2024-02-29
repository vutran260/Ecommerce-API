import { IsNotEmpty, IsString } from "class-validator";

export default class CategoryCreateRequest {
  parent_id: string;

  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsNotEmpty()
  category_tag: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}