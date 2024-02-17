import { UserRepository } from './repository/UserRepository';
import { SellerUsecase } from './usecase/SellerUsecase';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import * as schema from '../lib/posgres/schema';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sellerRepository } from './repository/SellerRepository';


export class sellerSiteRouter {
  private db:  PostgresJsDatabase<typeof schema>;


  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getSellerSiteRouter = () => {

    const router = express.Router();

    const userRepo = new UserRepository(this.db)
    const sellerRepo = new sellerRepository(this.db)
    const sellerUsecase = new SellerUsecase(userRepo, sellerRepo)
    const sellerEndpoint = new SellerEndpoint(sellerUsecase)

    router.use('/seller', sellerEndpoint.getRouter())

    return router
  }

}

