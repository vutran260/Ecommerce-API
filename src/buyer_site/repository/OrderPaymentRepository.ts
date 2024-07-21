import { Transaction } from 'sequelize';
import { LP_ORDER_PAYMENT } from '../../../src/lib/mysql/models/LP_ORDER_PAYMENT';
import { CreateOrderPaymentRequest } from '../../common/model/orders/Order';

export class OrderPaymentRepository {
  public createOrderPayment = async (
    oreateOrderPaymentRequest: CreateOrderPaymentRequest,
    t?: Transaction,
  ) => {
    const orderPayment = await LP_ORDER_PAYMENT.create(
      oreateOrderPaymentRequest,
      {
        transaction: t,
      },
    );
    return this.getOrderPaymentById(orderPayment.id, t);
  };

  public getOrderPaymentById = async (id: string, t?: Transaction) => {
    const result = await LP_ORDER_PAYMENT.findOne({
      where: { id },
      transaction: t,
    });
    return result?.dataValues;
  };

  public getOrderPaymentByOrderId = async (orderId: string) => {
    const result = await LP_ORDER_PAYMENT.findOne({
      where: { orderId },
    });
    return result?.dataValues;
  };
}
