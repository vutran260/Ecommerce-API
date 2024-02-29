import express from 'express';
import apikey from './lib/auth/apikey';
import { adminSiteRouter } from './admin_site/Router';
import { sellerSiteRouter } from './seller_site/Router';
import { SetupDB, dbConnection } from './lib/mysql/connection';

const router = express.Router();

/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/


// console.log("Starting");
// (async () => {
//   console.log("Starting")
//   try {
    
//   await sequelize?.sync({force: true});
//   } catch (error) {
//   console.log(error)  
//   }
// })();

SetupDB()


const adminSiteRoute = new adminSiteRouter(dbConnection)
const sellerSiteRoute = new sellerSiteRouter(dbConnection)
router.use('/admin_site', adminSiteRoute.getAdminSiteRouter())
router.use('/seller_site', sellerSiteRoute.getSellerSiteRouter())


export default router;
