import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import Logger from '../core/Logger';
import { AppDataSource } from '../data_source';
import { adminSiteRouter } from '../admin_site/router';

const router = express.Router();

try {
  AppDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!")
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err)
    })
}catch (e) {
  Logger.error(e)
}
/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/


const adminSiteRoute = new adminSiteRouter(AppDataSource)
router.use('/admin_site', adminSiteRoute.getAdminSiteRouter())


export default router;
