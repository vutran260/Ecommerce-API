import { ProductSpecialQuestionRepository } from '../repository/ProductSpecialQuestionRepository';
import CreateProductSpecialFaqRequest from '../../common/model/productSpecialFaq/CreateProductSpecialFaqRequest';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import { ProductSpecialFaqRepository } from '../repository/ProductSpecialFaqRepository';

export class ProductSpecialUseCase {
  private productSpecialQuestionRepo: ProductSpecialQuestionRepository;
  private productSpecialFaqRepo: ProductSpecialFaqRepository;

  constructor(
    productSpecialQuestionRepo: ProductSpecialQuestionRepository,
    productSpecialFaqRepo: ProductSpecialFaqRepository,
  ) {
    this.productSpecialQuestionRepo = productSpecialQuestionRepo;
    this.productSpecialFaqRepo = productSpecialFaqRepo;
  }

  public getQuestionList = async () => {
    const order = [];
    order.push({
      attribute: 'id',
      direction: 'ASC',
    });

    return await this.productSpecialQuestionRepo.getQuestionList(order);
  };

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
}
