export class UpdatePointHistoryRequest {
  orderId?: number;
  pointAction?: string;
  pointBefore?: number;
  pointAfter?: number;
  pointCount?: number;
  requestPoint?: number;
  requestPointType?: string;
  requestStatus?: string;

  constructor(
    orderId: number,
    pointAction?: string,
    pointBefore?: number,
    pointAfter?: number,
    pointCount?: number,
    requestPoint?: number,
    requestPointType?: string,
    requestStatus?: string,
  ) {
    this.orderId = orderId;
    this.pointAction = pointAction;
    this.pointBefore = pointBefore;
    this.pointAfter = pointAfter;
    this.pointCount = pointCount;
    this.requestPoint = requestPoint;
    this.requestPointType = requestPointType;
    this.requestStatus = requestStatus;
  }
}
