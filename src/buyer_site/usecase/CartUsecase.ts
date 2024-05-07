import { isEmpty } from "lodash";
import { ProductRepository } from "../../seller_site/repository/ProductRepository";
import { AddProductRequest } from "../endpoint/CartEndpoint";
import { CartRepository } from "../repository/CartRepository";
import { BadRequestError } from "../../lib/http/custom_error/ApiError";

export class CartUsecase {

  private productRepo: ProductRepository;
  private cartRepo: CartRepository;

  constructor(productRepo: ProductRepository, cartRepo: CartRepository) {
    this.productRepo = productRepo;
    this.cartRepo = cartRepo;
  }

  public addProduct = async (addProductRequest: AddProductRequest) => {
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

    await this.cartRepo.addProductToCart(addProductRequest.ToLP_CART());
    return 
  }

}