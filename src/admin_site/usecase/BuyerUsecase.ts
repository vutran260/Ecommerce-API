import { BuyerRepository } from '../repository/BuyerRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';

export class BuyerUsecase {
    private buyerRepo: BuyerRepository;

    constructor(buyerRepo: BuyerRepository) {
        this.buyerRepo = buyerRepo;
    }

    public getBuyer = async (filter: Filter[], paging: Paging, order: LpOrder[]) => {
        return this.buyerRepo.getBuyer(filter, paging, order);
    };

    public getBuyerById =async  (id: string) => {
        const rs =  await  this.buyerRepo.getBuyerById(id)
        if (!rs) {
          throw new NotFoundError()
        }
        return rs
    }
}