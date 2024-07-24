import {
  CreateOrderItemRequest,
  CreateOrderPaymentRequest,
  CreateOrderRequest,
  CreateShipmentRequest,
  Order,
  OrderItem,
  UpdateOrderStatusRequest,
} from '../../../src/common/model/orders/Order';
import {
  ChargeMethod,
  JobCd,
  OrderStatus,
  PaymentSatus,
  PaymentType,
} from '../../../src/lib/constant/Constant';
import Logger from '../../../src/lib/core/Logger';
import { lpSequelize } from '../../../src/lib/mysql/Connection';
import { LP_ORDER } from '../../../src/lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../../src/lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../../src/lib/paging/Order';
import { Filter, Paging } from '../../../src/lib/paging/Request';
import { GMOPaymentService } from '../../../src/third_party/gmo_getway/GMOPaymentSerivce';
import { TransactionRequest } from '../../../src/third_party/gmo_getway/request/EntryTransactionRequest';
import { ExecTransactionRequest } from '../../../src/third_party/gmo_getway/request/ExecTransactionRequest';
import { BadRequestError } from '../../lib/http/custom_error/ApiError';
import { AddressRepository } from '../repository/AddressRepository';
import { BuyerRepository } from '../repository/BuyerRepository';
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
  private buyerRepository: BuyerRepository;
  private addressRepository: AddressRepository;
  private gmoPaymentService: GMOPaymentService;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
    orderPaymentRepo: OrderPaymentRepository,
    shipmentRepository: ShipmentRepository,
    buyerRepository: BuyerRepository,
    addressRepository: AddressRepository,
    gmoPaymentService: GMOPaymentService,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
    this.gmoPaymentService = gmoPaymentService;
    this.orderPaymentRepo = orderPaymentRepo;
    this.shipmentRepository = shipmentRepository;
    this.buyerRepository = buyerRepository;
    this.addressRepository = addressRepository;
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

  public createOrder = async (orderCreateRequest: CreateOrderRequest) => {
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

        if (productsInMyCart && productsInMyCart.length <= 0) {
          throw new BadRequestError('Opps, have no any items in your cart');
        }
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
          paymentType: PaymentType.CREDIT_CARD,
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
          shipmentFeeDiscount: 0,
          shipmentDate: new Date(),
          shipmentBy: '',
          shipmentStartAt: new Date(),
          shipmentEndAt: new Date(),
        };
        await this.shipmentRepository.createShipment(oreateShipmentRequest, t);

        //update order status: CONFIRMED after check point
        const updateRequest: UpdateOrderStatusRequest = {
          orderId: order.id,
          status: OrderStatus.CONFIRMED,
        };
        this.orderRepo.updateOrderStatus(updateRequest, t);

        // Step 3: Entry transaction
        // make orderID have length  = 27 match with gmo require
        const orderIDForTran = order.id.substring(0, 27);
        if (
          !order.totalAmount ||
          (order.totalAmount && order.totalAmount <= 0)
        ) {
          throw new BadRequestError();
        }
        const transactionRequest: TransactionRequest = {
          orderID: orderIDForTran,
          jobCd: JobCd.CAPTURE,
          amount: order.totalAmount,
        };
        const theTransInfo = await this.gmoPaymentService.entryTran(
          transactionRequest,
        );

        // Step 4: Execute transaction
        if (theTransInfo) {
          const execTransactionRequest = new ExecTransactionRequest(
            theTransInfo.accessID,
            theTransInfo.accessPass,
            orderIDForTran,
            ChargeMethod.BULK, // 1: Bulk 2: Installment 3: Bonus (One time) 5: Revolving
            orderCreateRequest.token,
          );
          const execTranResponse = await this.gmoPaymentService.execTran(
            execTransactionRequest,
          );

          if (execTranResponse) {
            // update order status: SUCESS
            const updateRequest: UpdateOrderStatusRequest = {
              orderId: order.id,
              status: OrderStatus.SUCESS,
            };

            this.orderRepo.updateOrderStatus(updateRequest, t);
          }
        }

        await t.commit();
      } else {
        await t.rollback();
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

  public getOrderItemsByOrderId = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    orderId: string,
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
}
