import { InternalError } from '../../lib/http/custom_error/ApiError';
import { LP_SELLER, LP_SELLERCreationAttributes } from '../../lib/mysql/models/LP_SELLER';

export class SellerRepository {

  public createSeller = async (input: LP_SELLERCreationAttributes) => {
    const lpSeller = await LP_SELLER.create(input);
    return await this.getSellerById(lpSeller.id);
  };

  public getSellerById = async (id: string) => {
    const result = await LP_SELLER.findOne({ where: { id: id } });
    return result?.dataValues;
  };


  public addStoreId = async (sellerId:string , storeId: string) => {
    const result = await LP_SELLER.update({storeId: storeId}, {where: {id: sellerId}})
    if( result[0] === 0) {
      throw new InternalError("Fail to add store to seller")
    }
  };

}
