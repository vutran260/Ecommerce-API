import { UserRepository } from '../repository/UserRepository';
import { sellerRepository } from '../repository/SellerRepository';
import crypto from 'crypto';
import { createTokens } from '../../lib/auth/authUtils';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';

export class SellerUsecase {
  private userRepo: UserRepository;
  private sellerRepo: sellerRepository


  constructor(userRepo: UserRepository, sellerRepo: sellerRepository) {
    this.userRepo = userRepo;
    this.sellerRepo = sellerRepo
  }

  public RegisterSeller = async (user: any) => {
    try {
      let userFromDb = await this.userRepo.getUserById(user.id)
      if (userFromDb === null) {
        userFromDb = await this.userRepo.createUser(user)
      }

      const seller = await this.sellerRepo.createSeller(userFromDb)

      const accessTokenKey = crypto.randomBytes(64).toString('hex');
      const refreshTokenKey = crypto.randomBytes(64).toString('hex');
      const token = await createTokens(user.id, accessTokenKey, refreshTokenKey);
      return token

    }catch (e) {
      throw e
    }
  };

  public GetTokenBySellerId = async (id: string) => {
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
