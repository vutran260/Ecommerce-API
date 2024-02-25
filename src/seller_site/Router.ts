import { UserRepository } from './repository/UserRepository';
import { SellerUsecase } from './usecase/SellerUsecase';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import * as schema from '../lib/posgres/schema';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sellerRepository } from './repository/SellerRepository';
import { ProductRepository } from './repository/ProductRepository';
import { ProductUsecase } from './usecase/ProductUsecase';
import { ProductEndpoint } from './endpoint/ProductEndpoint';
import { CategoryRepository } from './repository/CategoryRepository';
import { CategoryUsecase } from './usecase/CategoryUsecase';
import { CategoryEndpoint } from './endpoint/CategoryEndpoint';

export class sellerSiteRouter {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getSellerSiteRouter = () => {
    const router = express.Router();

    const userRepo = new UserRepository(this.db);
    const sellerRepo = new sellerRepository(this.db);
    const sellerUsecase = new SellerUsecase(userRepo, sellerRepo);
    const sellerEndpoint = new SellerEndpoint(sellerUsecase);

    const productRepo = new ProductRepository(this.db);
    const productUsecase = new ProductUsecase(productRepo);
    const productEndpoint = new ProductEndpoint(productUsecase);

    const categorytRepo = new CategoryRepository(this.db);
    const categoryUsecase = new CategoryUsecase(categorytRepo);
    const categoryEndpoint = new CategoryEndpoint(categoryUsecase);

    router.use('/seller', sellerEndpoint.getRouter());
    router.use('/product', productEndpoint.getRouter());
    router.use('/category', categoryEndpoint.getRouter());
    return router;
  };
}
