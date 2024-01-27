import express from 'express';
import apikey from './lib/auth/apikey';
import permission from './lib/helpers/permission';
import { Permission } from './lib/database/model/ApiKey';
import { adminSiteRouter } from './admin_site/router';
import { dbConnection } from './lib/posgres/connection';

const router = express.Router();

/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/


const adminSiteRoute = new adminSiteRouter(dbConnection)
router.use('/admin_site', adminSiteRoute.getAdminSiteRouter())


export default router;
