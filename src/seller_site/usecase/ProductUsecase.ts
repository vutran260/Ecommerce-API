import ProductCreateRequest from '../../admin_site/requests/products/ProductCreateRequest';
import { ProductRepository } from '../repository/ProductEndpoint';

export class ProductUsecase {
  private productRepo: ProductRepository;

  constructor(productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    return this.productRepo.createProduct(productCreateRequest);
  };

  public updateProduct = async (
    productCreateRequest: ProductCreateRequest,
    id: string,
  ) => {
    return this.productRepo.updateProduct(productCreateRequest, id);
  };

  public deleteProduct = async (id: string) => {
    return this.productRepo.deleteProduct(id);
  };
}
