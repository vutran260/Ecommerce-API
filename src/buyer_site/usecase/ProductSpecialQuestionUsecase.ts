import { ProductSpecialQuestionRepository } from '../repository/ProductSpecialQuestionRepository';

export class ProductSpecialQuestionUseCase {
  private productSpecialQuestionRepo: ProductSpecialQuestionRepository;

  constructor(productSpecialQuestionRepo: ProductSpecialQuestionRepository) {
    this.productSpecialQuestionRepo = productSpecialQuestionRepo;
  }

  public getQuestionList = async () => {
    const order = [];
    order.push({
      attribute: 'id',
      direction: 'ASC',
    });

    return await this.productSpecialQuestionRepo.getQuestionList(order);
  };
}
