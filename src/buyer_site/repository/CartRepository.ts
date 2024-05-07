import { LP_CART, LP_CARTCreationAttributes } from "../../lib/mysql/models/LP_CART";

export class CartRepository {

  public addProductToCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.create(input);
  }

}