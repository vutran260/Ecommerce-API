import { PointHistoryRepository } from '../repository/PointHistoryRepository';
import { Transaction } from 'sequelize';
import { CreatePointHistoryRequest } from '../../common/model/pointHistory/createPointHistoryRequest';
import { BuyerUsecase } from '../../buyer_site/usecase/BuyerUsecase';
import { InternalError } from '../../lib/http/custom_error/ApiError';
import { get, isEmpty } from 'lodash';
import { UpdatePointHistoryRequest } from '../../common/model/pointHistory/updatePointHistoryRequest';
import { LP_POINT_HISTORY_LOGS } from '../../lib/mysql/models/LP_POINT_HISTORY_LOGS';
import { PointAction } from '../../lib/constant/point/PointAction';
import { RequestPointType } from '../../lib/constant/point/RequestPointType';
import { RequestPointStatus } from '../../lib/constant/point/RequestPointStatus';

export class PointHistoryUseCase {
  private pointHistoryRepository: PointHistoryRepository;
  private buyerUseCase: BuyerUsecase;

  constructor(
    pointHistoryRepository: PointHistoryRepository,
    buyerUseCase: BuyerUsecase,
  ) {
    this.pointHistoryRepository = pointHistoryRepository;
    this.buyerUseCase = buyerUseCase;
  }

  public savePointHistory = async (params: {
    orderId: number;
    buyerId: string;
    storeId: string;
    pointAction: PointAction;
    pointCount: number;
    requestPoint: number;
    requestPointType: RequestPointType;
    requestStatus: RequestPointStatus;
    t?: Transaction;
  }) => {
    const {
      orderId,
      buyerId,
      storeId,
      pointAction,
      pointCount,
      requestPoint,
      requestPointType,
      requestStatus,
      t,
    } = params;
    const request: CreatePointHistoryRequest = {
      orderId: orderId,
      buyerId: buyerId,
      storeId: storeId,
      pointAction: pointAction,
      // pointBefore: order.point,
      // pointAfter: order.point + point,
      pointCount: pointCount,
      requestPoint: requestPoint,
      requestPointType: requestPointType,
      requestStatus: requestStatus,
    };
    return this.pointHistoryRepository.createPointHistory(request, t);
  };

  public usePoint = async (params: {
    buyerId: string;
    storeId: string;
    orderId?: number;
    pointUse?: number;
    requestStatus: RequestPointStatus;
    t?: Transaction;
  }) => {
    const { buyerId, storeId, orderId, pointUse, requestStatus, t } = params;

    const whereCondition = {
      buyerId: buyerId,
      storeId: storeId,
      pointAction: PointAction.USE_POINT,
      requestPointType: RequestPointType.POINT,
      requestStatus: RequestPointStatus.PENDING,
    };

    if (isEmpty(pointUse) || pointUse === undefined) {
      return await this.pointHistoryRepository.deletePointHistory(
        whereCondition,
      );
    }

    const buyerInfo = await this.buyerUseCase.getBuyerInfo(buyerId, storeId);
    if (!buyerInfo) {
      throw new InternalError('Buyer not found');
    }

    const totalPoints = get(buyerInfo.dataValues, 'totalPoints') || 0;
    if (Number(pointUse) > Number(totalPoints)) {
      throw new InternalError('Not enough points');
    }

    const request: CreatePointHistoryRequest = {
      orderId: orderId,
      buyerId: buyerId,
      storeId: storeId,
      pointAction: PointAction.USE_POINT,
      // pointBefore: order.point,
      // pointAfter: order.point + point,
      pointCount: -1 * pointUse,
      requestPoint: pointUse,
      requestPointType: RequestPointType.POINT,
      requestStatus: requestStatus,
    };
    return this.pointHistoryRepository.upsertPointHistory(
      request,
      whereCondition,
      t,
    );
  };

  public updatePointHistory = async (params: {
    buyerId: string;
    storeId: string;
    orderId?: number;
    requestStatus: RequestPointStatus;
    t?: Transaction;
  }): Promise<LP_POINT_HISTORY_LOGS | null> => {
    const { buyerId, storeId, orderId, requestStatus, t } = params;

    const request: UpdatePointHistoryRequest = {
      orderId: orderId,
      // pointBefore: order.point,
      // pointAfter: order.point + point,
      requestStatus: requestStatus,
    };

    await this.pointHistoryRepository.updatePointHistory(
      request,
      {
        buyerId: buyerId,
        storeId: storeId,
        pointAction: PointAction.USE_POINT,
        requestPointType: RequestPointType.POINT,
        requestStatus: RequestPointStatus.PENDING,
      },
      t,
    );

    return await this.pointHistoryRepository.getPointHistory(
      {
        buyerId: buyerId,
        storeId: storeId,
        orderId: orderId,
      },
      t,
    );
  };

  public calculatePoint = (amount: number) => {
    return Math.floor(amount * 0.01);
  };
}
