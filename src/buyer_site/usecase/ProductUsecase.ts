import Product, { ProductToLP_PRODUCT } from '../requests/products/Product';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import {
  CreateProductInput,
  ProductRepository,
} from '../repository/ProductRepository';
import { CategoryRepository } from '../repository/CategoryRepository';

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

    return this.productRepo.getProducts(filter, order, paging, categoryIds);
  };
}
