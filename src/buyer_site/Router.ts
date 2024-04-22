import express from 'express';
import { BuyerAuthenMiddlleware } from './middleware/BuyerAuthenMiddleware';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';

export class buyerSiteRouter {

  public getBuyerSiteRouter = () => {

    const router = express.Router();

    const buyerEndpoint = new BuyerEndpoint();

    router.use(BuyerAuthenMiddlleware)
    
    router.use('/buyer', buyerEndpoint.getRouter())

    return router
  }

}

