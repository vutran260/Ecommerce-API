import express from 'express';
import apikey from './lib/auth/apikey';
import permission from './lib/helpers/permission';
import { Permission } from './lib/database/model/ApiKey';
import { adminSiteRouter } from './admin_site/Router';
import { dbConnection, sequelize } from './lib/mysql/Connection';
import { sellerSiteRouter } from './seller_site/Router';

const router = express.Router();

/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/


(async () => {
  await sequelize.sync({force: true});
})();


const adminSiteRoute = new adminSiteRouter(dbConnection)
const sellerSiteRoute = new sellerSiteRouter(dbConnection)
router.use('/admin_site', adminSiteRoute.getAdminSiteRouter())
router.use('/seller_site', sellerSiteRoute.getSellerSiteRouter())


export default router;
