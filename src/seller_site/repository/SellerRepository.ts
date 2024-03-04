import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { LP_SELLER } from '../../lib/mysql/models/LP_SELLER';

export class SellerRepository {

  public createSeller = async (input: any) => {
    const result = await this.getSellerById(input.id);
    if (result != null) {
      throw new BadRequestError('seller already registered');
    }
    const rs = await LP_SELLER.create(input);
    console.log(rs);
    return rs;
  };

  public getSellerById = async (id: string) => {
    const result = await LP_SELLER.findOne({ where: { id: id } });
    return result?.dataValues;
  };
}
