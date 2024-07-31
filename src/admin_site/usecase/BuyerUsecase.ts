import { BuyerRepository } from '../repository/BuyerRepository';
import { Filter, Paging } from '../../lib/paging/Request';
import { LpOrder } from '../../lib/paging/Order';

export class BuyerUsecase {
    private buyerRepo: BuyerRepository;

    constructor(buyerRepo: BuyerRepository) {
        this.buyerRepo = buyerRepo;
    }

    public GetBuyer = async (filter: Filter[], paging: Paging, order: LpOrder[], searchString: string) => {
        return this.buyerRepo.getBuyer(filter, paging, order, searchString);
    };
}