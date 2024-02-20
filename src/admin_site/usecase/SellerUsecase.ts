import { UserRepository } from '../repository/UserRepository';
import { SellerRepository } from '../repository/SellerRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import ProductCreateRequest from '../requests/products/ProductCreateRequest';

export class SellerUsecase {
  private sellerRepo: SellerRepository;

  constructor(sellerRepo: SellerRepository) {
    this.sellerRepo = sellerRepo;
  }

  public GetSeller = async (filter: Filter[], paging: Paging) => {
    return this.sellerRepo.getSeller(filter, paging);
  };

  public createProduct = async (productCreateRequest: ProductCreateRequest) => {
    return this.sellerRepo.createProduct(productCreateRequest);
  };

  public updateProduct = async (
    productCreateRequest: ProductCreateRequest,
    id: string,
  ) => {
    return this.sellerRepo.updateProduct(productCreateRequest, id);
  };

  public deleteProduct = async (id: string) => {
    return this.sellerRepo.deleteProduct(id);
  };
}
