import { UserRepository } from './repository/userRepository';
import { SellerUsecase } from './usecase/sellerUsecase';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/index';
import { AdminRepository } from './repository/adminRepository';
import { AdminUsecase } from './usecase/adminUsecase';
import { admin } from '../lib/posgres/schema';
import { AdminEndpoint } from './endpoint/adminEndpoint';
import { SellerEndpoint } from './endpoint/sellerEndpoint';
import *  as schema from '../lib/posgres/schema';


export class adminSiteRouter {
  private db : PostgresJsDatabase<typeof schema>

  constructor(db:  PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  public getAdminSiteRouter = () => {

    const router = express.Router();
    const userRepo = new UserRepository(this.db)
    const adminRepo = new AdminRepository(this.db)

    const userUsecase = new SellerUsecase(userRepo)
    const adminUsecase = new AdminUsecase(adminRepo)

    const userEndpoint = new SellerEndpoint(userUsecase)
    const adminEndpoint = new AdminEndpoint(adminUsecase)


    router.use('/user', userEndpoint.getRouter())
    router.use('/admin', adminEndpoint.getRouter())

    return router
  }

}

