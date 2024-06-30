import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import { ProductRepository } from '../repository/ProductRepository';
import { CategoryRepository } from '../repository/CategoryRepository';
import { ProductFromLP_PRODUCT } from '../../common/model/products/Product';
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

  public getProducts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    categoryId: string,
  ) => {

    const  NO_CATEGORY= "0"
    
    let categoryIds = null
    let products : LP_PRODUCT[]=[];

    if (!!categoryId){
      if(categoryIds !==NO_CATEGORY){
        categoryIds = await this.categoryRepo.getAllLeafInSub(categoryId);
        products = await this.productRepo.getProducts(filter, order, paging, categoryIds);
      }
      if(!!categoryId &&categoryId ===NO_CATEGORY){
        products = await this.productRepo.getProductsWithoutCategories(filter, order, paging);
      }

    }else{
      products = await this.productRepo.getProducts(filter, order, paging, categoryIds);
    }

    return products.map((product) => {
      return ProductFromLP_PRODUCT(product)
    });
  };
}
