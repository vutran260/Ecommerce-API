import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateProductSpecialFaqRequest {
  buyerId: string;

  storeId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  question1: number;

  @IsString()
  @IsNotEmpty()
  answer1: string;

  @IsNumber()
  @IsNotEmpty()
  question2: number;

  @IsString()
  @IsNotEmpty()
  answer2: string;

  @IsNumber()
  @IsNotEmpty()
  question3: number;

  @IsString()
  @IsNotEmpty()
  answer3: string;

  @IsNumber()
  @IsNotEmpty()
  question4: number;

  @IsString()
  @IsNotEmpty()
  answer4: string;

  @IsNumber()
  @IsNotEmpty()
  question5: number;

  @IsString()
  @IsNotEmpty()
  answer5: string;

  @IsNumber()
  @IsNotEmpty()
  question6: number;

  @IsString()
  @IsNotEmpty()
  answer6: string;

  @IsNumber()
  @IsNotEmpty()
  question7: number;

  @IsString()
  @IsNotEmpty()
  answer7: string;

  @IsNumber()
  @IsNotEmpty()
  question8: number;

  @IsString()
  @IsNotEmpty()
  answer8: string;

  @IsNumber()
  @IsNotEmpty()
  question9: number;

  @IsString()
  @IsNotEmpty()
  answer9: string;

  @IsNumber()
  @IsNotEmpty()
  question10: number;

  @IsString()
  @IsNotEmpty()
  answer10: string;

  @IsNumber()
  @IsNotEmpty()
  question11: number;

  @IsString()
  @IsNotEmpty()
  answer11: string;

  @IsNumber()
  @IsNotEmpty()
  question12: number;

  @IsString()
  @IsNotEmpty()
  answer12: string;

  @IsNumber()
  @IsNotEmpty()
  question13: number;

  @IsString()
  @IsNotEmpty()
  answer13: string;
}
