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
import { AddressRepository } from './repository/AddressRepository';
import { AddressUsecase } from './usecase/AddressUsecase';
import { AddressEndpoint } from './endpoint/AddressEndpoint';

export class buyerSiteRouter {
  public getBuyerSiteRouter = () => {
    const router = express.Router();

    const buyerRepo = new BuyerRepository();
    const categorytRepo = new CategoryRepository();
    const productRepo = new ProductRepository();
    const storeRepo = new StoreRepository();
    const addressRepo = new AddressRepository()

    const buyerUsecase = new BuyerUsecase(buyerRepo);
    const productUsecase = new ProductUsecase(productRepo, categorytRepo);
    const storeUsecase = new StoreUsecase(storeRepo);
    const addressUsecase = new AddressUsecase(addressRepo)

    const buyerEndpoint = new BuyerEndpoint(buyerUsecase);
    const productEndpoint = new ProductEndpoint(productUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase);
    const addressEndpoint = new AddressEndpoint(addressUsecase)

    const cartRepo = new CartRepository();
    const cartUseCase = new CartUsecase(productRepo, cartRepo);
    const cartEndpoint = new CartEndpoint(cartUseCase);

    router.use('/buyer', buyerEndpoint.getRouter());
    router.use(BuyerAuthenMiddlleware);
    router.use('/cart', cartEndpoint.getRouter());

    router.use('/address', addressEndpoint.getRouter())
    router.use(BuyerAuthenMiddlleware)
    router.use('/product', productEndpoint.getRouter());
    router.use('/store', storeEndpoint.getRouter());

    return router;
  };
}
