import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubscriptionAddress {
  id: string;

  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  firstNameKana: string;

  @IsString()
  @IsNotEmpty()
  lastNameKana: string;

  @IsString()
  @IsNotEmpty()
  firstNameKanji: string;

  @IsString()
  @IsNotEmpty()
  lastNameKanji: string;

  @IsNumber()
  gender: number;

  @IsString()
  @IsNotEmpty()
  prefectureCode: string;

  @IsNumber()
  agreed: number;

  @IsNumber()
  keepContact: number;

  @IsString()
  @IsNotEmpty()
  postCode: string;

  @IsString()
  @IsNotEmpty()
  cityTown: string;

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  buildingName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephoneNumber: string;
}
