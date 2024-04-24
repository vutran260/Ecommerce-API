import { SellerRepository } from '../repository/SellerRepository';
import crypto from 'crypto';
import { createTokens } from '../../lib/auth/authUtils';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { LP_SELLERCreationAttributes } from '../../lib/mysql/models/LP_SELLER';

export class SellerUsecase {
  private sellerRepo: SellerRepository


  constructor( sellerRepo: SellerRepository) {
    this.sellerRepo = sellerRepo
  }

  public RegisterSeller = async (sellerInput: LP_SELLERCreationAttributes) => {
    try {
      const seller = await this.sellerRepo.createSeller(sellerInput)

      const accessTokenKey = crypto.randomBytes(64).toString('hex');
      const refreshTokenKey = crypto.randomBytes(64).toString('hex');
      const token = await createTokens(seller?.id||'', accessTokenKey, refreshTokenKey);
      return token

    }catch (e) {
      throw e
    }
  };

  public GetTokenById = async (id: string) => {
    const  seller = await  this.sellerRepo.getSellerById(id)
    if (seller == null) {
      throw new BadRequestError("seller not existed")
    }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const token = await createTokens(seller.id, accessTokenKey, refreshTokenKey);
    return token
  }


}
