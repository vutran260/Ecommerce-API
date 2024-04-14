import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import ProductComponent from "./ProductCompoment";
import ProductOption from "./ProductOption";
import ProductOptionPrice from "./ProductOptionPrice";

export default class ProductCreateRequest {

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubscription: boolean;

  @IsArray()
  buyingTimeOption?: number[];

  @IsArray()
  buyingPeriod?: number[];

  @IsBoolean()
  @IsNotEmpty()
  isRecomend: boolean;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsArray()
  @IsNotEmpty()
  productImage: string[];

  @IsString()
  @IsNotEmpty()
  productDescription: string;

  @IsString()
  @IsNotEmpty()
  capacity: string;


  @IsNotEmpty()
  @IsString()
  expirationUseDate: string;

  @IsString()
  @IsNotEmpty()
  storageMethod: string;


  @IsString()
  @IsNotEmpty()
  intakeMethod: string;


  @IsString()
  @IsNotEmpty()
  ingredient: string;
  
  @IsString()
  @IsNotEmpty()
  notificationNumber: string;


  @IsString()
  @IsNotEmpty()
  notification: string;


  @IsBoolean()
  @IsNotEmpty()
  hasOption: boolean;


  @IsString()
  @IsNotEmpty()
  productTag: string;


  @IsString()
  @IsNotEmpty()
  status: string;

  price: string;
  
  priceBeforeDiscount: string;

  cost: string;

  stockItem: number;

  @IsArray()
  components: ProductComponent[];

  @IsArray()
  options: ProductOption[];

  @IsArray()
  optionPrices: ProductOptionPrice[];
}



