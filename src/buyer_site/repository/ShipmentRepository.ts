import { Transaction } from 'sequelize';
import { CreateShipmentRequest } from '../../common/model/orders/Order';
import { LP_SHIPMENT } from '../../lib/mysql/models/LP_SHIPMENT';

export class ShipmentRepository {
  public createShipment = async (
    createShipmentRequest: CreateShipmentRequest,
    t?: Transaction,
  ) => {
    const shipment = await LP_SHIPMENT.create(createShipmentRequest, {
      transaction: t,
    });
    return this.getShipmentById(shipment.orderId, t);
  };

  public getShipmentById = async (id: number, t?: Transaction) => {
    const result = await LP_SHIPMENT.findOne({
      where: { orderId: id },
      transaction: t,
    });
    return result?.dataValues;
  };

  public getShipmentByOrderId = async (orderId: number) => {
    const result = await LP_SHIPMENT.findOne({
      where: { orderId },
    });
    return result?.dataValues;
  };
}
