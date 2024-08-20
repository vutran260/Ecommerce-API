import { Transaction } from 'sequelize';
import { PaymentSatus } from '../../lib/constant/Constant';
import { LP_ORDER_PAYMENT } from '../../lib/mysql/models/LP_ORDER_PAYMENT';
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
    return this.getOrderPaymentById(orderPayment.orderId, t);
  };

  public getOrderPaymentById = async (id: number, t?: Transaction) => {
    const result = await LP_ORDER_PAYMENT.findOne({
      where: { orderId: id },
      transaction: t,
    });
    return result?.dataValues;
  };

  public getOrderPaymentByOrderId = async (orderId: number) => {
    const result = await LP_ORDER_PAYMENT.findOne({
      where: { orderId },
    });
    return result?.dataValues;
  };

  public updateOrderPaymentStatus = async (
    orderId: number,
    status: PaymentSatus,
    t?: Transaction,
  ) => {
    await LP_ORDER_PAYMENT.update(
      { paymentStatus: status, updatedAt: new Date() },
      {
        where: { orderId: orderId },
        transaction: t,
      },
    );
  };
}
