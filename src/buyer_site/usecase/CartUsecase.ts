import { isEmpty, update } from "lodash";
import { ProductRepository } from "../../seller_site/repository/ProductRepository";
import { ProductRequest } from "../endpoint/CartEndpoint";
import { CartRepository } from "../repository/CartRepository";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";

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
    if (await this.cartRepo.getProductInCart(addProductRequest.ToLP_CART().productId, addProductRequest.ToLP_CART().storeId, addProductRequest.ToLP_CART().buyerId)) {
      await this.cartRepo.updateQuantityProductCart(addProductRequest.ToLP_CART())
      return
    }
    await this.cartRepo.addProductToCart(addProductRequest.ToLP_CART());
    return
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
    const product = await this.cartRepo.getCart(storeId, buyerId)
    return product
  }

  public deleteProducts = async (ids: string[], storeId: string, buyerId: string) => {
    await this.cartRepo.deleteProducts(ids, storeId, buyerId)

  }



}