import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class RegisterSellerRequest {
  contactId: string;

  @IsString()
  @IsNotEmpty()
  prefectureId: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
