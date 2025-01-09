import { BuildOrderQuery, LpOrder } from '../../lib/paging/Order';
import { LP_PRODUCT_SPECIAL_QUESTIONS } from '../../lib/mysql/models/LP_PRODUCT_SPECIAL_QUESTIONS';

export class ProductSpecialQuestionRepository {
  public getQuestionList = async (
    order: LpOrder[],
  ) => {
    return await LP_PRODUCT_SPECIAL_QUESTIONS.findAll({
      order: BuildOrderQuery(order),
    });
  };
}
