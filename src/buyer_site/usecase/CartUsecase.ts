import { CartItem } from "../endpoint/CartEndpoint";
import { CartRepository } from "../repository/CartRepository";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";
import Logger from "../../lib/core/Logger";
import { ProductRepository } from '../repository/ProductRepository';

export class CartUsecase {

  private productRepo: ProductRepository;
  private cartRepo: CartRepository;

  constructor(productRepo: ProductRepository, cartRepo: CartRepository) {
    this.productRepo = productRepo;
    this.cartRepo = cartRepo;
  }

  public addItem = async (addItemRequest: CartItem) => {
    if (addItemRequest.isSubscription) {
      if (addItemRequest.buyingTimeOption === null) {
        throw new BadRequestError('Missing buying time option');
      }

      if (addItemRequest.buyingPeriod === null) {
        throw new BadRequestError('Missing buying period');
      }

      if (addItemRequest.startBuyingDate === null) {
        throw new BadRequestError('Missing start buying date');
      }

      const product = await this.productRepo.getProductId(addItemRequest.productId);
      if (!product.isSubscription) {
        throw new BadRequestError('Product is not subscription');
      }
    }

    if (!addItemRequest.isSubscription) {
      const item = await this.cartRepo.getNomalItemInCart(
        addItemRequest.productId,
        addItemRequest.storeId,
        addItemRequest.buyerId);

      if (!!item && !item.isSubscription) {
        Logger.info("Product already exists in cart increase quantity");
        await this.cartRepo.increaseQuantityProductCart(item.id, addItemRequest.quantity);
        return this.cartRepo.getItemById(item.id);
      }
    }
    await this.cartRepo.addItemToCart(addItemRequest.ToLP_CART());
  }



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
        throw new BadRequestError('Product is not subscription');
      }
    }

    await this.cartRepo.updateItemInCart(cartItem.ToLP_CART());
    return this.cartRepo.getItemById(cartItem.id);
  }

  public deleteItem = async (id: string) => {
    await this.cartRepo.deleteItem(id)
  }

  public getListItemInCart = async (storeId: string, buyerId: string,) => {
    const items = await this.cartRepo.getListItemInCart(storeId, buyerId)

    return items.map(item => CartItem.FromLP_CART(item));
  }

  public deleteItems = async (ids: string[]) => {
    await this.cartRepo.deleteItems(ids)

  }

}