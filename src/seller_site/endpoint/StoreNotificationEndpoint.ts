import { ProtectedRequest } from "../../lib/http/app-request";
import { StoreNotificationUsecase } from "../usecase/StoreNotificationUsecase";
import { validatorRequest } from "../../lib/helpers/validate";
import { plainToInstance } from "class-transformer";
import { ResponseData } from "../../lib/http/Response";
import express, { Request, Response } from 'express';
import { IsNotEmpty, IsString } from "class-validator";


export class StoreNotificationEndpoint {
  private storeNotificationUsecase: StoreNotificationUsecase;

  constructor(storeNotificationUsecase: StoreNotificationUsecase) {
    this.storeNotificationUsecase = storeNotificationUsecase;
  }

  private createNotification = async (req: ProtectedRequest, res: Response) => {
    const addNotificationRequest = plainToInstance(StoreNotification, req.body);
    addNotificationRequest.storeId = req.storeId;

    await validatorRequest(addNotificationRequest);
    await this.storeNotificationUsecase.CreateNotification(addNotificationRequest);
    return ResponseData("add notification success!!!", res);
  };

  private updateNotification = async (req: ProtectedRequest, res: Response) => {
    const updateNotificationRequest = plainToInstance(StoreNotification, req.body);
    updateNotificationRequest.storeId = req.storeId
    // updateItemRequest.storeId = req.storeId;

    await validatorRequest(updateNotificationRequest);
    await this.storeNotificationUsecase.updateNotification(updateNotificationRequest);
    return ResponseData("update notification success!!!", res);
  }

  private deleteNotification = async (req: ProtectedRequest, res: Response) => {
    const notificationId: string = req.params.id;
    await this.storeNotificationUsecase.deleteNotification(notificationId);
    return ResponseData({ message: 'Deleted is successfully!' }, res);

  }


  private getNotification = async (req: ProtectedRequest, res: Response) => {
    const id: string = req.params.id;

    const results = await this.storeNotificationUsecase.getNotification(id);
    return ResponseData(results, res)
  }



  public getRouter() {
    const router = express.Router();

    router.post('/', this.createNotification);
    router.get('/:id', this.getNotification);
    router.delete('/:id', this.deleteNotification);
    router.put('/', this.updateNotification);
    return router;
  }
}


export class StoreNotification {
  id: string

  @IsString()
  @IsNotEmpty()
  storeId: string;


  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  notificationImage: string;

  @IsString()
  @IsNotEmpty()
  details: string;
}