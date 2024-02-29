import { UserRepository } from './repository/UserRepository';
import { SellerUsecase } from './usecase/SellerUsecase';
import express from 'express';
import { AdminRepository } from './repository/AdminRepository';
import { AdminUsecase } from './usecase/AdminUsecase';
import { AdminEndpoint } from './endpoint/AdminEndpoint';
import { SellerEndpoint } from './endpoint/SellerEndpoint';
import *  as schema from '../lib/mysql/schema';
import { adminAuthenMiddlleware } from './middleware/AuthenMiddlleware';
import { SellerRepository } from './repository/SellerRepository';
import { MySql2Database } from 'drizzle-orm/mysql2';


export class adminSiteRouter {
  private db: MySql2Database<typeof schema>;

  constructor(db: MySql2Database<typeof schema>) {
    this.db = db;
  }

  public getAdminSiteRouter = () => {

    const router = express.Router();
    const adminRepo = new AdminRepository(this.db)
    const userRepo = new UserRepository(this.db)
    const sellerRepo = new SellerRepository(this.db)

    const userUsecase = new SellerUsecase(sellerRepo)
    const adminUsecase = new AdminUsecase(adminRepo)

    const sellerEndpoint = new SellerEndpoint(userUsecase)
    const adminEndpoint = new AdminEndpoint(adminUsecase)


    router.use('/admin', adminEndpoint.getRouter())
    router.use(adminAuthenMiddlleware)
    router.use('/seller', sellerEndpoint.getRouter())

    return router
  }

}

