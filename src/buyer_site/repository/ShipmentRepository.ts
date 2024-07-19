import { Transaction } from 'sequelize';
import { LP_SHIPMENT } from '../../../src/lib/mysql/models/LP_SHIPMENT';
import { LP_ORDER_PAYMENT } from '../../lib/mysql/models/LP_ORDER_PAYMENT';
import { CreateShipmentRequest } from '../../../src/common/model/orders/Order';

export class ShipmentRepository {
  public createShipment = async (
    createShipmentRequest: CreateShipmentRequest,
    t?: Transaction,
  ) => {
    const shipment = await LP_SHIPMENT.create(createShipmentRequest, {
      transaction: t,
    });
    return this.getShipmentById(shipment.id, t);
  };

  public getShipmentById = async (id: string, t?: Transaction) => {
    const result = await LP_ORDER_PAYMENT.findOne({
      where: { id },
      transaction: t,
    });
    return result?.dataValues;
  };
}
