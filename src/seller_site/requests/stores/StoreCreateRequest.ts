import { IsNotEmpty, IsString } from 'class-validator';

export default class StoreCreateRequest {

  @IsString()
  @IsNotEmpty()
  prefectureId: string;

  @IsString()
  @IsNotEmpty()
  storeKey: string;

  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
