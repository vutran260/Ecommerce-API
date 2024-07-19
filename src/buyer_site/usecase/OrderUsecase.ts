import {
  CreateOrderItemRequest,
  CreateOrderPaymentRequest,
  CreateOrderRequest,
  CreateShipmentRequest,
  Order,
} from '../../../src/common/model/orders/Order';
import {
  ChargeMethod,
  JobCd,
  PaymentSatus,
} from '../../../src/lib/constant/Constant';
import Logger from '../../../src/lib/core/Logger';
import { lpSequelize } from '../../../src/lib/mysql/Connection';
import { LP_ORDER } from '../../../src/lib/mysql/models/LP_ORDER';
import { LpOrder } from '../../../src/lib/paging/Order';
import { Filter, Paging } from '../../../src/lib/paging/Request';
import { GMOPaymentService } from '../../../src/third_party/gmo_getway/GMOPaymentSerivce';
import { TransactionRequest } from '../../../src/third_party/gmo_getway/request/EntryTransactionRequest';
import { ExecTransactionRequest } from '../../../src/third_party/gmo_getway/request/ExecTransactionRequest';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { CartRepository } from '../repository/CartRepository';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderPaymentRepository } from '../repository/OrderPaymentRepository';
import { OrderRepository } from '../repository/OrderRepository';
import { ShipmentRepository } from '../repository/ShipmentRepository';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;
  private cartRepo: CartRepository;
  private orderPaymentRepo: OrderPaymentRepository;
  private shipmentRepository: ShipmentRepository;
  private gmoPaymentService: GMOPaymentService;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
    orderPaymentRepo: OrderPaymentRepository,
    shipmentRepository: ShipmentRepository,
    gmoPaymentService: GMOPaymentService,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
    this.gmoPaymentService = gmoPaymentService;
    this.orderPaymentRepo = orderPaymentRepo;
    this.shipmentRepository = shipmentRepository;
  }

  public checkFraud = async (type: string, userId: string) => {
    return this.gmoPaymentService.checkFraud(type, userId);
  };

  public entryTran = async (transactionRequest: TransactionRequest) => {
    return await this.gmoPaymentService.entryTran(transactionRequest);
  };

  public execTran = async (execTransactionRequest: ExecTransactionRequest) => {
    return await this.gmoPaymentService.execTran(execTransactionRequest);
  };

  public createOrder = async (
    orderCreateRequest: CreateOrderRequest,
    token: string,
  ) => {
    // TODO: check fraud
    // const theFraud = await this.checkFraud(orderCreateRequest.buyerId, '');

    // Step 1: Shift Events
    // if (theFraud && Number(theFraud.paymentAbuseScore) >= 20) {
    // }
    const t = await lpSequelize.transaction();

    // Step 2: Create order
    try {
      // create order after click Proceed to order at Cart screen
      const order = await this.orderRepo.createOrder(orderCreateRequest, t);

      if (order) {
        // add products from cart to order item
        const productsInMyCart = await this.cartRepo.getListItemInCart(
          orderCreateRequest.storeId,
          orderCreateRequest.buyerId,
        );

        if (productsInMyCart && productsInMyCart.length > 0) {
          const cartItemLength = productsInMyCart.length;
          for (let i = 0; i < cartItemLength; i++) {
            const cartItem = productsInMyCart[i];
            let input = new CreateOrderItemRequest(cartItem);
            input.orderId = order.id;
            await this.orderItemRepo.createOrderItem(input, t);

            // delete cart item
            await this.cartRepo.deleteItem(cartItem.id, t);
          }

          // add payment info
          const oreateOrderPaymentRequest: CreateOrderPaymentRequest = {
            orderId: order.id,
            paymentType: 1,
            paymentStatus: PaymentSatus.PENDING,
          };
          await this.orderPaymentRepo.createOrderPayment(
            oreateOrderPaymentRequest,
            t,
          );

          // add shipment info
          const oreateShipmentRequest: CreateShipmentRequest = {
            orderId: order.id,
            shipmentFee: order.shipmentFee,
            shipmentFeeDiscount: 0, // TODO
            shipmentDate: new Date(),
            shipmentBy: '', // TODO
          };
          await this.shipmentRepository.createShipment(
            oreateShipmentRequest,
            t,
          );

          // TODO: calculate total cost and fee
          let totalCost =
            order.totalFee && order.totalOrderItemFee
              ? order.totalFee + order.totalOrderItemFee
              : 0;

          // Step 3: Entry transaction
          const transactionRequest: TransactionRequest = {
            orderID: order.id,
            jobCd: JobCd.Capture,
            amount: totalCost,
          };
          const theTransInfo = await this.gmoPaymentService.entryTran(
            transactionRequest,
          );

          // Step 4: Execute transaction
          if (theTransInfo) {
            const execTransactionRequest = new ExecTransactionRequest(
              theTransInfo.accessID,
              theTransInfo.accessPass,
              order.id,
              ChargeMethod.Bulk, // 1: Bulk 2: Installment 3: Bonus (One time) 5: Revolving
              token,
            );
            await this.gmoPaymentService.execTran(execTransactionRequest);
          }
          await t.commit();
        } else {
          await t.rollback();
        }
      }

      return order;
    } catch (error) {
      await t.rollback();
      Logger.error('Fail to create order');
      Logger.error(error);
      throw error;
    }
  };

  public getOrderById = async (id: string) => {
    const result = await this.orderRepo.getOrderById(id);
    if (!result) {
      throw new NotFoundError();
    }
    return result;
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
}
