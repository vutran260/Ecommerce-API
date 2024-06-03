import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { LP_BUYERAttributes } from "../../../lib/mysql/models/LP_BUYER";

export default class Buyer {

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
