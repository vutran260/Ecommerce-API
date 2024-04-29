import { createTokens } from '../../lib/auth/authUtils';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { LP_BUYERCreationAttributes } from '../../lib/mysql/models/LP_BUYER';
import { BuyerRepository } from '../repository/BuyerRepository';
import crypto from 'crypto';

export class BuyerUsecase {
  private buyerRepo: BuyerRepository;

  constructor(buyerRepo: BuyerRepository) {
    this.buyerRepo = buyerRepo;
  }

  public registerBuyer = async (buyerInput: LP_BUYERCreationAttributes) => {
    try {
      const buyer = await this.buyerRepo.createBuyer(buyerInput);

      const accessTokenKey = crypto.randomBytes(64).toString('hex');
      const refreshTokenKey = crypto.randomBytes(64).toString('hex');

      const token = await createTokens(
        buyer?.id || '',
        accessTokenKey,
        refreshTokenKey,
      );
      return token;
    } catch (error) {
      throw error;
    }
  };

  public getCategoriesWithHierarchy = async (store_id: string, id = '') => {
    return this.buyerRepo.getCategoriesWithHierarchy(store_id, id);
  };

  public getTokenById = async (id: string) => {
    const buyer = await this.buyerRepo.getBuyerById(id);
    if (buyer == null) {
      throw new BadRequestError('Buyer not existed');
    }

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const token = await createTokens(buyer.id, accessTokenKey, refreshTokenKey);
    return token;
  };
}
