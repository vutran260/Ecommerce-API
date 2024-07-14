import { BadRequestError } from "../../lib/http/custom_error/ApiError";
import { StoreNotification } from "../endpoint/StoreNotificationEndpoint";
import { StoreNotificationRepository } from "../repository/StoreNotificationRepository";

export class StoreNotificationUsecase {
  private storeNotificationRepo: StoreNotificationRepository


  constructor(storeNotificationRepo: StoreNotificationRepository) {
    this.storeNotificationRepo = storeNotificationRepo
  }

  public CreateNotification = async (Notification: StoreNotification) => {
    if (!Notification.notificationImage) {
      throw new BadRequestError('Missing image')
    }
    if (!Notification.title) {
      throw new BadRequestError('Missing title')
    }
    if (!Notification.details) {
      throw new BadRequestError('Missing details')
    }
    await this.storeNotificationRepo.createNotification(Notification)

  }

  public updateNotification = async (updateNotificationRequest: StoreNotification) => {

    const notification = await this.storeNotificationRepo.getNotificationById(updateNotificationRequest.id);
    if (!notification) {
      throw new BadRequestError('notification not exist');
    }
    await this.storeNotificationRepo.updateNotification(updateNotificationRequest.id, updateNotificationRequest);
    return this.storeNotificationRepo.getNotificationById(updateNotificationRequest.id);
  }

  public deleteNotification = async (id: string) => {
    await this.storeNotificationRepo.deleteNotification(id)
  }
  public getNotification = async (id: string,) => {
    const notification = await this.storeNotificationRepo.getNotificationById(id)
    return notification
  }

  public activeNotification = async (id: string) => {
    return this.storeNotificationRepo.activeNotificationId(id);
  };
  public inactiveNotification = async (id: string) => {
    return this.storeNotificationRepo.inactiveNotificationId(id);
  };


}
