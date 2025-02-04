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

  public getQuestionListMap = async (): Promise<Record<number, string>> => {
    const faqQuestions = await this.productSpecialQuestionRepo.getQuestionList([
      {
        attribute: 'id',
        direction: 'ASC',
      },
    ]);
    return faqQuestions.reduce(
      (acc, question) => {
        acc[question.id] = question.question || '';
        return acc;
      },
      {} as Record<number, string>,
    );
  };
}
