import { UserRepository } from './repository/userRepository';
import { UserUsecase } from './usecase/userUsecase';
import { UserEndpoint } from './endpoint/userEndpoint';
import express from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/index';
import { AdminRepository } from './repository/adminRepository';
import { AdminUsecase } from './usecase/adminUsecase';
import { admin } from '../lib/posgres/schema';
import { AdminEndpoint } from './endpoint/AdminEndpoint';


export class adminSiteRouter {
  private db : PostgresJsDatabase

  constructor(db:  PostgresJsDatabase) {
    this.db = db;
  }

  public getAdminSiteRouter = () => {

    const router = express.Router();
    const userRepo = new UserRepository(this.db)
    const adminRepo = new AdminRepository(this.db)

    const userUsecase = new UserUsecase(userRepo)
    const adminUsecase = new AdminUsecase(adminRepo)

    const userEndpoint = new UserEndpoint(userUsecase)
    const adminEndpoint = new AdminEndpoint(adminUsecase)


    router.use('/user', userEndpoint.getRouter())
    router.use('/admin', adminEndpoint.getRouter())

    return router
  }

}

