import CreateProductSpecialFaqRequest from '../../common/model/productSpecialFaq/CreateProductSpecialFaqRequest';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { ProductSpecialFaqRepository } from '../repository/ProductSpecialFaqRepository';

export class ProductSpecialFaqUsecase {
  private productSpecialFaqRepo: ProductSpecialFaqRepository;

  constructor(productSpecialFaqRepo: ProductSpecialFaqRepository) {
    this.productSpecialFaqRepo = productSpecialFaqRepo;
  }

  public submitFaq = async (
    buyerId: string,
    storeId: string,
    request: CreateProductSpecialFaqRequest,
  ) => {
    const validate = plainToInstance(CreateProductSpecialFaqRequest, request);

    await validatorRequest(validate);

    request.storeId = storeId;
    request.buyerId = buyerId;

    return this.productSpecialFaqRepo.createProductSpecialFaq(request);
  };

  public detailFaq = async (params: {
    buyerId: string;
    storeId: string;
    productId: string;
  }) => {
    return this.productSpecialFaqRepo.detailProductSpecialFaq(params);
  };
}
