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

export class sellerSiteRouter {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getSellerSiteRouter = () => {
    const router = express.Router();

    const userRepo = new UserRepository(this.db);
    const sellerRepo = new SellerRepository(this.db);
    const sellerUsecase = new SellerUsecase(userRepo, sellerRepo);
    const sellerEndpoint = new SellerEndpoint(sellerUsecase);

    const productRepo = new ProductRepository(this.db);
    const productUsecase = new ProductUsecase(productRepo);
    const productEndpoint = new ProductEndpoint(productUsecase);

    router.use('/seller', sellerEndpoint.getRouter());
    router.use('/product', productEndpoint.getRouter());
    return router;
  };
}
