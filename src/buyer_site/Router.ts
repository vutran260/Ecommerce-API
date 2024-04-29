import express from 'express';
import { BuyerAuthenMiddlleware } from './middleware/BuyerAuthenMiddleware';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';
import { BuyerRepository } from './repository/BuyerRepository';
import { BuyerUsecase } from './usecase/BuyerUsecase';

export class buyerSiteRouter {
  public getBuyerSiteRouter = () => {
    const router = express.Router();

    const buyerRepo = new BuyerRepository();
    const buyerUsecase = new BuyerUsecase(buyerRepo);
    const buyerEndpoint = new BuyerEndpoint(buyerUsecase);

    router.use('/buyer', buyerEndpoint.getRouter());

    return router;
  };
}
