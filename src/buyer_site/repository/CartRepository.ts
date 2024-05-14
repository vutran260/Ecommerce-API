import { range } from "lodash";
import { NotFoundError } from "../../lib/http/custom_error/ApiError";
import { LP_CART, LP_CARTCreationAttributes } from "../../lib/mysql/models/LP_CART";
import Logger from "../../lib/core/Logger";
import { Op } from "sequelize";

export class CartRepository {

  public addProductToCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.create(input);
  }

  public getProductInCart = async (productId: string, storeId: string, buyerId: string) => {
    const product = await LP_CART.findOne(
      {
        where: {
          productId: productId,
          buyerId: buyerId,
          storeId: storeId
        }
      });
    if (product === null) {
      throw new NotFoundError(
        `Product with id ${productId} not found in cart of buyer ${buyerId} in store ${storeId}`);
    }
    return product
  }

  public isProductExistInCart = async (productId: string, storeId: string, buyerId: string) => {
    const count = await LP_CART.count(
      {
        where: {
          productId: productId,
          buyerId: buyerId,
          storeId: storeId
        }
      });
    return count > 0


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
      Logger.error(`Failed to delete product ${id} not found`);
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
    await LP_CART.destroy({
      where: {
        productId: { [Op.in]: ids },
        buyerId: buyerId,
        storeId: storeId
      },
    });
  }

  public getCart = async (storeId: string, buyerId: string):Promise<LP_CART[]>  => {
    let product = []
    product = await LP_CART.findAll({
      include: [
        {
          association: LP_CART.associations.product,
        }
      ],
      where: {
        storeId: storeId,
        buyerId: buyerId
      },
    })
    return product
  }
}


