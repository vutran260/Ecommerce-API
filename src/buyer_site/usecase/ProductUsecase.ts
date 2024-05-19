import lodash from "lodash";
import Product, { ProductToLP_PRODUCT } from '../requests/products/Product';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import {
  CreateProductInput,
  ProductRepository,
} from '../repository/ProductRepository';
import { CategoryRepository } from '../repository/CategoryRepository';
import { LP_PRODUCT } from '../../lib/mysql/models/LP_PRODUCT';

export class ProductUsecase {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;

  constructor(productRepo: ProductRepository,
    categoryRepo: CategoryRepository
  ) {
    this.productRepo = productRepo;
    this.categoryRepo= categoryRepo;
  }

  public detailProduct = async (id: string) => {
    return this.productRepo.getProductId(id);
  };

  private calculateProductPrice = (product:LP_PRODUCT): number => {
    let price: any = 0;
    if (!product.isSubscription) {
      price = product.price;
    } else {
      price = product.priceSubscription!;
    }

    if (!product.isDiscount) {
      return price;
    }

    const now = new Date();
    if (!product.hasDiscountSchedule || 
      (product.hasDiscountSchedule && (
        now <= product.discountTimeTo! &&
        now >= product.discountTimeFrom!
      ) )
    ) {
      price = (price * (100 - product.discountPercentage!)) / 100;
      return price;
    }
    return price
  };

  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryId: string,
  ) => {
    let categoryIds = null
    if (!!categoryId) {
    categoryIds = await this.categoryRepo.getAllLeafInSub(categoryId);
    } 
    const products = await this.productRepo.getProducts(filter, order, paging, categoryIds);
    const result = products.map((product) => {
      const price = this.calculateProductPrice(product);
      lodash.set(product.dataValues, "price", price);
      lodash.set(product, "price", price);
      return product.dataValues;
    })
    return result;
  };
}
