import { Filter, Paging } from '../../lib/paging/Request';
import { BuyerPostRepository } from '../repository/BuyerPostRepository';
import { LpOrder } from '../../lib/paging/Order';

export class BuyerPostUsecase {
  private buyerPostRepo: BuyerPostRepository;
  constructor(buyerPostRepo: BuyerPostRepository) {
    this.buyerPostRepo = buyerPostRepo;
  }

  public getPosts = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    console.log('filter', filter);
    return await this.buyerPostRepo.getPosts(paging, order, filter);
  };

  public getPost = async (id: string) => {
    const post = await this.buyerPostRepo.getPostById(id);
    return post;
  };
}
