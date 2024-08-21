import { CartItem } from '../endpoint/CartEndpoint';
import { CartRepository } from '../repository/CartRepository';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import Logger from '../../lib/core/Logger';
import { ProductRepository } from '../repository/ProductRepository';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';

export class CartUsecase {
  private productRepo: ProductRepository;
  private cartRepo: CartRepository;

  constructor(productRepo: ProductRepository, cartRepo: CartRepository) {
    this.productRepo = productRepo;
    this.cartRepo = cartRepo;
  }

  public addItem = async (addItemRequest: CartItem) => {
    const product = await this.productRepo.getProductId(
      addItemRequest.productId,
    );
    if (
      product.stockItem === 0 ||
      addItemRequest.quantity > product.stockItem
    ) {
      throw new BadRequestError(
        'The quantity of products left in stock is not enough',
        ErrorCode.OVER_STOCK,
      );
    }
    if (addItemRequest.isSubscription) {
      if (
        addItemRequest.buyingPeriod === undefined ||
        addItemRequest.buyingPeriod === null
      ) {
        throw new BadRequestError('Missing buying period');
      }

      if (
        addItemRequest.startBuyingDate === undefined ||
        addItemRequest.startBuyingDate === null
      ) {
        throw new BadRequestError('Missing start buying date');
      }

      if (!product.isSubscription) {
        throw new BadRequestError('Product is not subscription');
      }
      const subscriptionItem = await this.cartRepo.getSubscriptionItemInCart(
        addItemRequest.ToLP_CART(),
      );

      if (subscriptionItem) {
        if (
          subscriptionItem.quantity + addItemRequest.quantity >
          product.stockItem
        ) {
          throw new BadRequestError(
            'The quantity of products left in stock is not enough',
            ErrorCode.OVER_STOCK,
          );
        }

        Logger.info(
          'Subscription item already exists in cart increase quantity',
        );
        await this.cartRepo.increaseQuantityProductCart(
          subscriptionItem.id,
          addItemRequest.quantity,
        );
        return this.cartRepo.getItemById(subscriptionItem.id);
      }
    } else {
      const item = await this.cartRepo.getNormalItemInCart(
        addItemRequest.productId,
        addItemRequest.storeId,
        addItemRequest.buyerId,
      );

      if (!!item && !item.isSubscription) {
        if (item.quantity + addItemRequest.quantity > product.stockItem) {
          throw new BadRequestError(
            'The quantity of products left in stock is not enough',
            ErrorCode.OVER_STOCK,
          );
        }
        Logger.info('item already exists in cart increase quantity');
        await this.cartRepo.increaseQuantityProductCart(
          item.id,
          addItemRequest.quantity,
        );
        return this.cartRepo.getItemById(item.id);
      }
    }

    await this.cartRepo.addItemToCart(addItemRequest.ToLP_CART());
  };

  public updateItem = async (cartItem: CartItem) => {
    if (cartItem.isSubscription) {
      if (cartItem.buyingPeriod === null) {
        throw new BadRequestError('Missing buying period');
      }

      if (cartItem.startBuyingDate === null) {
        throw new BadRequestError('Missing start buying date');
      }

      const product = await this.productRepo.getProductId(cartItem.productId);
      if (!product.isSubscription) {
        throw new BadRequestError('item has not subscription');
      }

      const subscriptionItem = await this.cartRepo.getSubscriptionItemInCart(
        cartItem.ToLP_CART(),
      );
      if (!!subscriptionItem && cartItem.id !== subscriptionItem.id) {
        Logger.info(
          'Subscription item already exists in cart increase quantity',
        );
        await this.cartRepo.increaseQuantityProductCart(
          subscriptionItem.id,
          cartItem.quantity,
        );
        await this.deleteItem(cartItem.id);
        return this.cartRepo.getItemById(subscriptionItem.id);
      }
    }

    await this.cartRepo.updateItemInCart(cartItem.ToLP_CART());
    return this.cartRepo.getItemById(cartItem.id);
  };

  public deleteItem = async (id: string) => {
    await this.cartRepo.deleteItem(id);
  };

  public getListItemInCart = async (storeId: string, buyerId: string) => {
    const items = await this.cartRepo.getListItemInCart(storeId, buyerId);

    return items.map((item) => CartItem.FromLP_CART(item));
  };

  public deleteItems = async (ids: string[]) => {
    await this.cartRepo.deleteItems(ids);
  };

  public validateCart = async (storeId: string, buyerId: string) => {
    const items = await this.cartRepo.getListItemInCart(storeId, buyerId);
    const cartItems = items.map((item) => CartItem.FromLP_CART(item));

    const errors: {
      [key: string]: {
        errorCode: string;
        productId: string;
        errorMessage: string;
      }[];
    } = {};

    cartItems.forEach((item) => {
      if (item.quantity > item.product.stockItem) {
        if (!errors[item.id]) {
          errors[item.id] = [];
        }
        errors[item.id].push({
          errorCode: ErrorCode.OVER_STOCK,
          productId: item.productId,
          errorMessage: 'The quantity of products left in stock is not enough',
        });
      }
    });

    return errors;
  };
}
