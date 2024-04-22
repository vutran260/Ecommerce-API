import express from 'express';
import apikey from './lib/auth/apikey';
import { adminSiteRouter } from './admin_site/Router';
import { sellerSiteRouter } from './seller_site/Router';
import { SetupDB } from './lib/mysql/Connection';
import { buyerSiteRouter } from './buyer_site/Router';

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


const adminSiteRoute = new adminSiteRouter()
const sellerSiteRoute = new sellerSiteRouter()
const buyerSiteRoute = new buyerSiteRouter()
router.use('/admin_site', adminSiteRoute.getAdminSiteRouter())
router.use('/seller_site', sellerSiteRoute.getSellerSiteRouter())
router.use('/buyer_site', buyerSiteRoute.getBuyerSiteRouter())


export default router;
