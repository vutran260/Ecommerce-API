import CreateProductSpecialFaqRequest from '../../common/model/productSpecialFaq/CreateProductSpecialFaqRequest';
import { LP_PRODUCT_SPECIAL_FAQ } from '../../lib/mysql/models/LP_PRODUCT_SPECIAL_FAQ';
import { Transaction } from 'sequelize';

export class ProductSpecialFaqRepository {
  public createProductSpecialFaq = async (
    request: CreateProductSpecialFaqRequest,
    t?: Transaction,
  ) => {
    return await LP_PRODUCT_SPECIAL_FAQ.create(request, {
      transaction: t,
    });
  };
}
