import { IsString, IsNotEmpty } from 'class-validator';

export default class LoginRequest {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
