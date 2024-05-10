import { range } from "lodash";
import { NotFoundError } from "../../lib/http/custom_error/ApiError";
import { LP_CART, LP_CARTCreationAttributes } from "../../lib/mysql/models/LP_CART";

export class CartRepository {

  public addProductToCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.create(input);
  }

  public getProductInCart = async (id: string, storeId: string, buyerId: string) => {
    const product = await LP_CART.findOne(
      {
        where: {
          productId: id,
          buyerId: buyerId,
          storeId: storeId
        }
      });
    if (product === null) {
      return new NotFoundError(`Product with id ${id} not found in cart`);

    }
    return product
  }

  public updateQuantityProductCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.increment('quantity', {
      by: input.quantity,
      where: {
        productId: input.productId,
        storeId: input.storeId,
        buyerId: input.buyerId
      },
    });

  }

  public updateProductInCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.update(
      {
        quantity: input.quantity,
        buyingTimeOption: input.buyingTimeOption,
        buyingPeriod: input.buyingPeriod,
        startBuyingDate: input.startBuyingDate,
        updatedBy: input.buyerId,
        isSubscription: input.isSubscription
      },
      {
        where: {
          productId: input.productId,
          storeId: input.storeId,
          buyerId: input.buyerId
        },
      },

    )
  }

  public deleteProduct = async (id: string, storeId: string, buyerId: string) => {

    const lpProduct = await LP_CART.findOne({
      where: {
        productId: id,
        storeId: storeId,
        buyerId: buyerId

      }
    }
    );
    if (!lpProduct) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    await LP_CART.destroy({
      where: {
        productId: id,
        storeId: storeId,
        buyerId: buyerId,
      },
    });
  }

  public deleteProducts = async (ids: string[], storeId: string, buyerId: string) => {
    for (let i = 0; i < ids.length; i++) {

      const lpProduct = await LP_CART.findOne({
        where: {
          productId: ids[i],
          storeId: storeId,
          buyerId: buyerId
        }
      }
      );
      if (!lpProduct) {
        throw new NotFoundError(`Product with id ${ids[i]} not found`);
      }
      await LP_CART.destroy({
        where: {
          productId: ids[i],
          buyerId: buyerId,
          storeId: storeId
        },
      });
    }
  }

  public getCart = async (storeId: string, buyerId: string) => {
    let product = []
    product = await LP_CART.findAll({
      where: {
        storeId: storeId,
        buyerId: buyerId
      },
    })
    // console.log(`=========================================`, a)
    if (product.length === 0) {
      return new NotFoundError(`Cart with store id ${storeId} and buyer id  ${buyerId}  not found`);
    }
    return product
  }


}



//   public getCart = async () => {
//   const product = await LP_CART.findAll()
// }
// }