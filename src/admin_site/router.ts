import { UserRepository } from './repository/userRepository';
import { SellerUsecase } from './usecase/sellerUsecase';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/index';
import { AdminRepository } from './repository/adminRepository';
import { AdminUsecase } from './usecase/adminUsecase';
import { admin } from '../lib/posgres/schema';
import { AdminEndpoint } from './endpoint/AdminEndpoint';
import { SellerEndpoint } from './endpoint/sellerEndpoint';
import *  as schema from '../lib/posgres/schema';
import { adminAuthenMiddlleware } from './middleware/authenMiddlleware';
import { SellerRepository } from './repository/SellerRepository';


export class adminSiteRouter {
  private db : PostgresJsDatabase<typeof schema>

  constructor(db:  PostgresJsDatabase<typeof schema>) {
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

