import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import {
  LP_CART,
  LP_CARTCreationAttributes,
} from '../../lib/mysql/models/LP_CART';
import Logger from '../../lib/core/Logger';
import { Op, Transaction } from 'sequelize';

export class CartRepository {
  public addItemToCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.create(input);
  };

  public getItemById = async (id: string) => {
    const product = await LP_CART.findOne({
      where: {
        id: id,
      },
    });
    return product;
  };

  public getSubscriptionItemInCart = async (
    input: LP_CARTCreationAttributes,
  ) => {
    const product = await LP_CART.findOne({
      where: {
        productId: input.productId,
        buyerId: input.buyerId,
        storeId: input.storeId,
        buyingPeriod: input.buyingPeriod,
        startBuyingDate: input.startBuyingDate,
        isSubscription: true,
      },
    });
    return product;
  };

  public getNormalItemInCart = async (
    productId: string,
    storeId: string,
    buyerId: string,
  ) => {
    const product = await LP_CART.findOne({
      where: {
        productId: productId,
        buyerId: buyerId,
        storeId: storeId,
        isSubscription: false,
      },
    });
    return product;
  };

  public isProductExistInCart = async (
    productId: string,
    storeId: string,
    buyerId: string,
  ) => {
    const count = await LP_CART.count({
      where: {
        productId: productId,
        buyerId: buyerId,
        storeId: storeId,
      },
    });
    return count > 0;
  };

  public increaseQuantityProductCart = async (id: string, quantity: number) => {
    await LP_CART.increment('quantity', {
      by: quantity,
      where: {
        id: id,
      },
    });
  };

  public updateItemInCart = async (input: LP_CARTCreationAttributes) => {
    await LP_CART.update(
      {
        quantity: input.quantity,
        buyingPeriod: input.buyingPeriod,
        startBuyingDate: input.startBuyingDate,
        updatedBy: input.buyerId,
        isSubscription: input.isSubscription,
      },
      {
        where: {
          id: input.id,
        },
      },
    );
  };

  public deleteItem = async (id: string, t?: Transaction) => {
    const lpProduct = await LP_CART.findOne({
      where: {
        id: id,
      },
    });
    if (!lpProduct) {
      Logger.error(`Failed to delete product ${id} not found`);
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    await LP_CART.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });
  };

  public deleteItems = async (ids: string[]) => {
    await LP_CART.destroy({
      where: {
        id: { [Op.in]: ids },
      },
    });
  };

  public getListItemInCart = async (
    storeId: string,
    buyerId: string,
  ): Promise<LP_CART[]> => {
    return await LP_CART.findAll({
      include: [
        {
          association: LP_CART.associations.product,
        },
      ],
      where: {
        storeId: storeId,
        buyerId: buyerId,
      },
    });
  };

  public getSpecialItemInCart = async (
    storeId: string,
    buyerId: string,
  ): Promise<LP_CART[]> => {
    return await LP_CART.findAll({
      include: [
        {
          association: LP_CART.associations.product,
        },
      ],
      where: {
        storeId: storeId,
        buyerId: buyerId,
        isSpecial: true,
      },
    });
  };
}
