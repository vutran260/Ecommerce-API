import { UserRepository } from './repository/UserRepository';
import { SellerUsecase } from './usecase/SellerUsecase';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import * as schema from '../lib/mysql/schema';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SellerRepository } from './repository/SellerRepository';
import { ProductRepository } from './repository/ProductRepository';
import { ProductUsecase } from './usecase/ProductUsecase';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CategoryRepository } from './repository/CategoryRepository';
import { CategoryUsecase } from './usecase/CategoryUsecase';
import { CategoryEndpoint } from './endpoint/CategoryEndpoint';
import { StoreRepository } from './repository/StoreRepository';
import { StoreUsecase } from './usecase/StoreUsecase';
import { StoreEndpoint } from './endpoint/StoreEndpoint';
import { sellerAuthenMiddlleware as SellerAuthenMiddlleware } from './middleware/AuthenMiddleware';

export class sellerSiteRouter {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getSellerSiteRouter = () => {
    const router = express.Router();

    const userRepo = new UserRepository();
    const sellerRepo = new SellerRepository();
    const storeRepo = new StoreRepository()
    const productRepo = new ProductRepository();
    const categorytRepo = new CategoryRepository();

    const sellerUsecase = new SellerUsecase(userRepo, sellerRepo);
    const storeUsecase = new StoreUsecase(storeRepo, sellerRepo)
    const categoryUsecase = new CategoryUsecase(categorytRepo);
    const productUsecase = new ProductUsecase(productRepo);

    
    const productEndpoint = new ProductEndpoint(productUsecase);
    const categoryEndpoint = new CategoryEndpoint(categoryUsecase);
    const storeEndpoint = new StoreEndpoint(storeUsecase)
    const sellerEndpoint = new SellerEndpoint(sellerUsecase);


    router.use('/seller', sellerEndpoint.getRouter());
    router.use(SellerAuthenMiddlleware)
    router.use('/store', storeEndpoint.getRouter())
    router.use('/product', productEndpoint.getRouter());
    router.use('/category', categoryEndpoint.getRouter());
    return router;
  };
}

// module.exports = { timestamps: false }
    // "gen-model": "sequelize-auto -o ./src/lib/mysql/models -l ts -a ./config.js -d link-palette-dev -h localhost -u link-palette -p 1111 -x P@ssw0rd -e mysql"