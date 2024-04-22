import express from 'express';
import { BuyerAuthenMiddlleware } from './middleware/BuyerAuthenMiddleware';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';

export class adminSiteRouter {

  public getAdminSiteRouter = () => {

    const router = express.Router();

    const buyerEndpoint = new BuyerEndpoint();

    router.use(BuyerAuthenMiddlleware)
    
    router.get('/buyer', buyerEndpoint.getRouter())

    return router
  }

}

