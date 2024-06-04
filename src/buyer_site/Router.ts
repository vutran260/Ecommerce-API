import express from 'express';
import { BuyerAuthenMiddlleware } from './middleware/BuyerAuthenMiddleware';
import { BuyerEndpoint } from './endpoint/BuyerEndpoint';
import { BuyerRepository } from './repository/BuyerRepository';
import { BuyerUsecase } from './usecase/BuyerUsecase';
import { CategoryRepository } from './repository/CategoryRepository';
import { ProductRepository } from './repository/ProductRepository';
import { ProductUsecase } from './usecase/ProductUsecase';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { StoreRepository } from './repository/StoreRepository';
import { StoreUsecase } from './usecase/StoreUsecase';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { CartEndpoint } from './endpoint/CartEndpoint';
import { CartUsecase } from './usecase/CartUsecase';
import { CartRepository } from './repository/CartRepository';

export class buyerSiteRouter {
  public getBuyerSiteRouter = () => {
    const router = express.Router();

    const buyerRepo = new BuyerRepository();
    const categorytRepo = new CategoryRepository();
    const productRepo = new ProductRepository();
    const storeRepo = new StoreRepository();

    const buyerUsecase = new BuyerUsecase(buyerRepo);
    const productUsecase = new ProductUsecase(productRepo, categorytRepo);
    const storeUsecase = new StoreUsecase(storeRepo);

    const buyerEndpoint = new BuyerEndpoint(buyerUsecase);
    const productEndpoint = new ProductEndpoint(productUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase);


    const cartRepo = new CartRepository();
    const cartUseCase = new CartUsecase(productRepo, cartRepo);
    const cartEndpoint = new CartEndpoint(cartUseCase);

    router.use('/buyer', buyerEndpoint.getRouter());
    router.use(BuyerAuthenMiddlleware);
    router.use('/cart', cartEndpoint.getRouter());


    router.use(BuyerAuthenMiddlleware)
    router.use('/product', productEndpoint.getRouter());
    router.use('/store', storeEndpoint.getRouter());

    return router;
  };
}
