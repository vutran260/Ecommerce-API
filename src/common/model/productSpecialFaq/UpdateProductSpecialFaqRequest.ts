import { IsOptional, IsString } from 'class-validator';

export default class UpdateProductSpecialFaqRequest {
  @IsString()
  @IsOptional()
  status: string;
}
