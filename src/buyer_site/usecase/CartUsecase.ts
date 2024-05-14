import lodash, { isEmpty, update } from "lodash";
import { ProductRepository } from "../../seller_site/repository/ProductRepository";
import { ProductRequest } from "../endpoint/CartEndpoint";
import { CartRepository } from "../repository/CartRepository";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";
import Logger from "../../lib/core/Logger";
import { LP_CART } from "../../lib/mysql/models/LP_CART";

export class CartUsecase {

  private productRepo: ProductRepository;
  private cartRepo: CartRepository;

  constructor(productRepo: ProductRepository, cartRepo: CartRepository) {
    this.productRepo = productRepo;
    this.cartRepo = cartRepo;
  }

  public addProduct = async (addProductRequest: ProductRequest) => {
    if (addProductRequest.isSubscription) {
      if (isEmpty(addProductRequest.buyingTimeOption)) {
        throw new BadRequestError('Missing buying time option');
      }

      if (isEmpty(addProductRequest.buyingPeriod)) {
        throw new BadRequestError('Missing buying period');
      }

      if (isEmpty(addProductRequest.startBuyingDate)) {
        throw new BadRequestError('Missing start buying date');
      }

      const product = await this.productRepo.getProductId(addProductRequest.productId);
      if (!product.isSubscription) {
        throw new BadRequestError('Product is not subscription');
      }
    }

    const isPrroductExist = await this.cartRepo.isProductExistInCart(
      addProductRequest.productId,
      addProductRequest.storeId,
      addProductRequest.buyerId);
    if (isPrroductExist) {
      Logger.info("Product already exists in cart increase quantity");
      await this.cartRepo.updateQuantityProductCart(addProductRequest.ToLP_CART())
      return
    }
    await this.cartRepo.addProductToCart(addProductRequest.ToLP_CART());
  }



  public updateProduct = async (updateProduct: ProductRequest) => {
    if (updateProduct.isSubscription) {
      if (isEmpty(updateProduct.buyingTimeOption)) {
        throw new BadRequestError('Missing buying time option');
      }

      if (isEmpty(updateProduct.buyingPeriod)) {
        throw new BadRequestError('Missing buying period');
      }

      if (isEmpty(updateProduct.startBuyingDate)) {
        throw new BadRequestError('Missing start buying date');
      }

      const product = await this.productRepo.getProductId(updateProduct.productId);
      if (!product.isSubscription) {
        throw new BadRequestError('Product is not subscription');
      }
    }

    await this.cartRepo.updateProductInCart(updateProduct.ToLP_CART());
    return
  }

  public deleteProduct = async (id: string, storeId: string, buyerId: string) => {
    await this.cartRepo.deleteProduct(id, storeId, buyerId)
  }

  public getCart = async (storeId: string, buyerId: string,) => {
    const products = await this.cartRepo.getCart(storeId, buyerId)

    const out  = products.map(product =>{
      const price = this.calculateProductPrice(product);
      lodash.set(product.dataValues, "price", price);
      lodash.set(product, "price", price);
      return product.dataValues;
    });
    return out;
  }

  public deleteProducts = async (ids: string[], storeId: string, buyerId: string) => {
    await this.cartRepo.deleteProducts(ids, storeId, buyerId)

  }


  private calculateProductPrice = (cartProduct:LP_CART): number => {
    let price = 0;
    if (!cartProduct.isSubscription) {
      price = cartProduct.product.price;
    } else {
      price = cartProduct.product.priceSubscription!;
    }

    if (!cartProduct.product.isDiscount) {
      return price;
    }

    const now = new Date();
    if (!cartProduct.product.hasDiscountSchedule || 
      (cartProduct.product.hasDiscountSchedule && (
        now <= cartProduct.product.discountTimeTo! &&
        now >= cartProduct.product.discountTimeFrom!
      ) )
    ) {
      price = (price * (100 - cartProduct.product.discountPercentage!)) / 100;
      return price;
    }
    return price
  };


}