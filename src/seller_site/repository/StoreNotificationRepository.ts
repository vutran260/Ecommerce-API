import { Transaction } from 'sequelize';
import { StoreNotification } from '../endpoint/StoreNotificationEndpoint';
import { LP_STORE_NOTIFICATION } from '../../lib/mysql/models/LP_STORE_NOTIFICATION';


export class StoreNotificationRepository {

  public createNotification = async (notificationData: StoreNotification) => {
    const notification = await LP_STORE_NOTIFICATION.create(notificationData)
    return
  }

  public getNotificationById = async (id: string) => {

    const notification = await LP_STORE_NOTIFICATION.findByPk(id);
    return notification
  }

  public getAllNotifications = async () => {

    const notifications = await LP_STORE_NOTIFICATION.findAll();
    return notifications
  };

  public updateNotification = async (id: string, updateData: any) => {

    const result = await LP_STORE_NOTIFICATION.update(updateData, {
      where: { id: id }
    });
    return result
  };
  public deleteNotification = async (id: string) => {
    const result = await LP_STORE_NOTIFICATION.destroy({
      where: { id: id }
    });
  }
};

