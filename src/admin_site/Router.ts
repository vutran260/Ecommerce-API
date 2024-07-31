import { SellerUsecase } from './usecase/SellerUsecase';
import express from 'express';
import { AdminRepository } from './repository/AdminRepository';
import { AdminUsecase } from './usecase/AdminUsecase';
import { AdminEndpoint } from './endpoint/AdminEndpoint';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import { adminAuthenMiddlleware } from './middleware/AuthenMiddlleware';
import { SellerRepository } from './repository/SellerRepository';
import { BuyerRepository } from './repository/BuyerRepository';
import { StoreRepository } from './repository/StoreRepository';
import { StoreUsecase } from './usecase/StoreUsecase';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';


export class adminSiteRouter {

  public getAdminSiteRouter = () => {
    try {
    const router = express.Router();
    const adminRepo = new AdminRepository()
    const sellerRepo = new SellerRepository()
    const storeRepo = new StoreRepository();
    const buyerReppo = new BuyerRepository();


    const userUsecase = new SellerUsecase(sellerRepo)
    const adminUsecase = new AdminUsecase(adminRepo)
    const storeUsecase = new StoreUsecase(storeRepo);
    const buyrUsecase = new BuyerEndpoint(buyerReppo);


    const sellerEndpoint = new SellerEndpoint(userUsecase);
    const buyerEndpoint = new BuyerEndpoint(buyrUsecase);
    const adminEndpoint = new AdminEndpoint(adminUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase);



    router.use('/admin', adminEndpoint.getRouter())
    router.use(adminAuthenMiddlleware)
    router.use('/seller', sellerEndpoint.getRouter())
    router.use('/buyer', buyerEndpoint.getRouter())
    router.use('/store', storeEndpoint.getRouter());

    return router
    } catch (error) {
      console.error(error)
      throw error;
    }


  }

}

