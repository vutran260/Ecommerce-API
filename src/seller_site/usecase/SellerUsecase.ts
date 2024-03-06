import { UserRepository } from '../repository/UserRepository';
import { SellerRepository } from '../repository/SellerRepository';
import crypto from 'crypto';
import { createTokens } from '../../lib/auth/authUtils';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { LP_USER, LP_USERAttributes, LP_USERCreationAttributes } from '../../lib/mysql/models/LP_USER';
import { LP_ADMINCreationAttributes } from '../../lib/mysql/models/LP_ADMIN';

export class SellerUsecase {
  private userRepo: UserRepository;
  private sellerRepo: SellerRepository


  constructor(userRepo: UserRepository, sellerRepo: SellerRepository) {
    this.userRepo = userRepo;
    this.sellerRepo = sellerRepo
  }

  public RegisterSeller = async (user: LP_USERCreationAttributes) => {
    try {
      let userFromDb = await this.userRepo.getUserByContactId(user.contact_id)
      if (!!!userFromDb) {
        userFromDb = await this.userRepo.createUser(user)
      }

      const seller = await this.sellerRepo.createSeller(userFromDb!)

      const accessTokenKey = crypto.randomBytes(64).toString('hex');
      const refreshTokenKey = crypto.randomBytes(64).toString('hex');
      const token = await createTokens(userFromDb!.id, accessTokenKey, refreshTokenKey);
      return token

    }catch (e) {
      throw e
    }
  };

  public GetTokenBySellerContactId = async (contactId: string) => {
    const  seller = await  this.sellerRepo.getSellerByContactId(contactId)
    if (seller == null) {
      throw new BadRequestError("seller not existed")
    }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const token = await createTokens(seller.id, accessTokenKey, refreshTokenKey);
    return token
  }


}
