import { SellerUsecase } from './usecase/SellerUsecase';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import express from 'express';
import { SellerRepository } from './repository/SellerRepository';
import { ProductRepository } from './repository/ProductRepository';
import { ProductUsecase } from './usecase/ProductUsecase';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { CategoryRepository } from './repository/CategoryRepository';
import { CategoryUsecase } from './usecase/CategoryUsecase';
import { CategoryEndpoint } from './endpoint/CategoryEndpoint';
import { StoreRepository } from './repository/StoreRepository';
import { StoreUsecase } from './usecase/StoreUsecase';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { SellerAuthenMiddlleware as SellerAuthenMiddlleware } from './middleware/SellerAuthenMiddleware';
import { StoreAuthenMiddlleware } from './middleware/StoreAuthenMiddllware';

export class sellerSiteRouter {
  public getSellerSiteRouter = () => {
    const router = express.Router();

    const sellerRepo = new SellerRepository();
    const storeRepo = new StoreRepository()
    const productRepo = new ProductRepository();
    const categorytRepo = new CategoryRepository();

    const sellerUsecase = new SellerUsecase(sellerRepo);
    const storeUsecase = new StoreUsecase(storeRepo, sellerRepo)
    const categoryUsecase = new CategoryUsecase(categorytRepo);
    const productUsecase = new ProductUsecase(productRepo, categorytRepo);

    
    const productEndpoint = new ProductEndpoint(productUsecase);
    const categoryEndpoint = new CategoryEndpoint(categoryUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase)
    const sellerEndpoint = new SellerEndpoint(sellerUsecase);


    router.use('/seller', sellerEndpoint.getRouter());
    router.use(SellerAuthenMiddlleware)
    router.use('/store', storeEndpoint.getRouter())

    router.use(StoreAuthenMiddlleware)
    router.use('/product', productEndpoint.getRouter());
    router.use('/category', categoryEndpoint.getRouter());
    return router;
  };
}

// module.exports = { timestamps: false }
    // "gen-model": "sequelize-auto -o ./src/lib/mysql/models -l ts -a ./config.js -d link-palette-dev -h localhost -u link-palette -p 1111 -x P@ssw0rd -e mysql"