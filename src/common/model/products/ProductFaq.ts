import { IsNotEmpty, IsString } from "class-validator";
import { LP_PRODUCT_FAQAttributes } from "../../../lib/mysql/models/LP_PRODUCT_FAQ";

export default class ProductFaq {
  id: string;

  productId: string;

  @IsString()
  @IsNotEmpty()
  question: string;
  
  @IsString()
  @IsNotEmpty()
  answer: string;
}


export const ProductFaqFromLP_PRODUCT_COMPONENT = (component: LP_PRODUCT_FAQAttributes): ProductFaq => {
  return {
    id: component.id,
    productId: component.productId,
    question: component.question,
    answer: component.answer
  }
}

export const ProductFaqToLP_PRODUCT_COMPONENT = (component: LP_PRODUCT_FAQAttributes): LP_PRODUCT_FAQAttributes => {
  return {
    id: component.id,
    productId: component.productId,
    question: component.question,
    answer: component.answer
  }
}
