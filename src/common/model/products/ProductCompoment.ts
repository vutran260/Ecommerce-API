import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LP_PRODUCT_COMPONENTAttributes } from "../../../lib/mysql/models/LP_PRODUCT_COMPONENT";


export default class ProductComponent {
  id: string;

  productId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
  
  @IsString()
  @IsNotEmpty()
  unit: string;
}

export const ProductCompomentFromLP_PRODUCT_COMPONENT = (component: LP_PRODUCT_COMPONENTAttributes): ProductComponent => {
  return {
    id: component.id,
    productId: component.productId,
    amount: component.amount,
    unit: component.unit? component.unit: '',
  }
}

export const ProductCompomentToLP_PRODUCT_COMPONENT = (component: ProductComponent): LP_PRODUCT_COMPONENTAttributes => {
  return {
    id: component.id,
    productId: component.productId,
    amount: component.amount,
    unit: component.unit
  }
}