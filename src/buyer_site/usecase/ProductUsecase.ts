import lodash from "lodash";
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import {
  ProductRepository,
} from '../repository/ProductRepository';
import { CategoryRepository } from '../repository/CategoryRepository';
import { LP_PRODUCT } from '../../lib/mysql/models/LP_PRODUCT';
import { ProductFromLP_PRODUCT } from "../../common/model/products/Product";

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
    const products = await this.productRepo.getProducts(filter, order, paging, categoryIds);
    const result = products.map((product) => {
     return ProductFromLP_PRODUCT(product)
    })
    return result;
  };
}
