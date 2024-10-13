import {
  Order,
  OrderItem,
  UpdateOrderStatusRequest,
} from '../../common/model/orders/Order';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { plainToInstance } from 'class-transformer';
import { validatorRequest } from '../../lib/helpers/validate';
import {
  BadRequestError,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
import {
  OrderStatus,
  OrderType,
  PaymentSatus,
} from '../../lib/constant/Constant';
import { PaymentUseCase } from '../../buyer_site/usecase/PaymentUsecase';
import { OrderPaymentRepository } from '../../buyer_site/repository/OrderPaymentRepository';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_PRODUCT } from '../../lib/mysql/models/LP_PRODUCT';
import { LP_ORDER_CANCEL_REASON } from '../../lib/mysql/models/LP_ORDER_CANCEL_REASON';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';
import Logger from '../../lib/core/Logger';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;
  private paymentUseCase: PaymentUseCase;
  private orderPaymentRepo: OrderPaymentRepository;
  private mailUseCase: MailUseCase;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    paymentUseCase: PaymentUseCase,
    orderPaymentRepo: OrderPaymentRepository,
    mailUseCase: MailUseCase,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.paymentUseCase = paymentUseCase;
    this.orderPaymentRepo = orderPaymentRepo;
    this.mailUseCase = mailUseCase;
  }

  public getOrderById = async (id: number) => {
    return await this.orderRepo.getOrderById(id);
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
  ) => {
    let orders: LP_ORDER[] = [];
    orders = await this.orderRepo.getOrders(filter, order, paging);
    return orders.map((order) => {
      return new Order(order);
    });
  };

  public getOrderItemsByOrderId = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    orderId: number,
  ) => {
    let orders: LP_ORDER_ITEM[] = [];
    orders = await this.orderItemRepo.getListOrderItemByOrderId(
      filter,
      order,
      paging,
      orderId,
    );
    return orders.map((order) => {
      return new OrderItem(order);
    });
  };

  public updateOrderStatus = async (request: UpdateOrderStatusRequest) => {
    Logger.info(`Updating order status for order ID: ${request.orderId}`);

    const order = await this.orderRepo.getOrderById(request.orderId);
    if (!order) {
      Logger.error(`Order with ID ${request.orderId} not found.`);
      throw new NotFoundError(`Order with ID ${request.orderId} not found.`);
    }

    Logger.info(
      `Order found with ID: ${request.orderId}, current status: ${order.orderStatus}`,
    );

    request.currentStatus = order.orderStatus || '';
    const updateRequest = plainToInstance(UpdateOrderStatusRequest, request);
    await validatorRequest(updateRequest);
    Logger.info('Validated request successfully');

    const t = await lpSequelize.transaction();
    try {
      if (
        order.orderType === OrderType.SUBSCRIPTION &&
        request.status === OrderStatus.CONFIRMED_ORDER
      ) {
        Logger.info('Processing subscription transaction...');
        const res = await this.paymentUseCase.processTransaction({ order });
        Logger.info(
          `Transaction processed: Access ID: ${res?.accessId}, Access Pass: ${res?.accessPass}`,
        );

        await this.orderPaymentRepo.updateOrderPaymentStatus({
          orderId: order.id,
          status: PaymentSatus.PAID,
          gmoAccessId: res?.accessId || '',
          gmoAccessPass: res?.accessPass || '',
        });

        Logger.info('Order payment status updated to PAID');
      }

      Logger.info(`Updating order status to: ${request.status}`);
      const orderUpdated = await LP_ORDER.update(
        { orderStatus: request.status },
        {
          where: { id: request.orderId },
          transaction: t,
        },
      );

      if (orderUpdated[0] === 0) {
        Logger.error('Failed to update order status');
        throw new BadRequestError();
      }

      if (
        order.orderStatus === OrderStatus.CANCEL &&
        request.status !== OrderStatus.CANCEL
      ) {
        Logger.info(
          'Restoring product stock due to order status change from CANCEL',
        );
        const orderItems = await LP_ORDER_ITEM.findAll({
          where: { orderId: request.orderId },
          attributes: ['productId', 'quantity'],
          transaction: t,
        });

        for (const item of orderItems) {
          await LP_PRODUCT.decrement(
            { stockItem: item.quantity },
            { where: { id: item.productId }, transaction: t },
          );
          Logger.info(
            `Decremented stock for product ID: ${item.productId}, quantity: ${item.quantity}`,
          );
        }
      }

      if (request.status === OrderStatus.CANCEL) {
        Logger.info('Processing cancellation, updating stock and reasons');
        const orderItems = await LP_ORDER_ITEM.findAll({
          where: { orderId: request.orderId },
          attributes: ['productId', 'quantity'],
          transaction: t,
        });

        for (const item of orderItems) {
          await LP_PRODUCT.increment(
            { stockItem: item.quantity },
            { where: { id: item.productId }, transaction: t },
          );
          Logger.info(
            `Incremented stock for product ID: ${item.productId}, quantity: ${item.quantity}`,
          );
        }

        if (request.reasons) {
          Logger.info('Logging cancellation reasons');
          request.reasons.map(async (reason: string) => {
            await LP_ORDER_CANCEL_REASON.create(
              {
                orderId: order.id,
                cancelReason: reason,
              },
              {
                transaction: t,
              },
            );
            Logger.info(`Cancel reason logged: ${reason}`);
          });
        }

        if (order.lpOrderPayment.paymentStatus === PaymentSatus.PAID) {
          const { gmoAccessId, gmoAccessPass } = order.lpOrderPayment;
          if (gmoAccessId && gmoAccessPass) {
            Logger.info('Cancelling transaction due to order cancellation');
            await this.paymentUseCase.cancelTran(order);
            await this.orderPaymentRepo.updateOrderPaymentStatus({
              orderId: order.id,
              status: PaymentSatus.CANCELLED,
              gmoAccessId,
              gmoAccessPass,
              t,
            });
            Logger.info('Order payment status updated to CANCELLED');
          }
        }

        Logger.info('Sending cancellation email to seller');
        this.mailUseCase.sendMailSellerCancelOrder({
          order,
          reasons: request.reasons || [],
          canceledAt: new Date(),
        });
      }

      await t.commit();
      Logger.info(
        `Order status updated successfully for order ID: ${order.id}`,
      );
      return await this.orderRepo.getOrderById(order.id);
    } catch (error) {
      Logger.error('Failed to update order status');
      Logger.error(error);
      await t.rollback();
      throw error;
    }
  };
}
