import {
  CreateOrderItemRequest,
  CreateOrderPaymentRequest,
  CreateOrderRequest,
  CreateShipmentRequest,
  Order,
  OrderAddressBuyerCreate,
  OrderItem,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '../../common/model/orders/Order';
import {
  ChargeMethod,
  JobCd,
  OrderStatus,
  PaymentSatus,
  PaymentType,
  ShipmentPrice,
} from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import {
  BadRequestError,
  NotFoundError,
} from '../../lib/http/custom_error/ApiError';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
import { GMOPaymentService } from '../../third_party/gmo_getway/GMOPaymentSerivce';
import { TransactionRequest } from '../../third_party/gmo_getway/request/EntryTransactionRequest';
import { ExecTransactionRequest } from '../../third_party/gmo_getway/request/ExecTransactionRequest';
import { CartItem } from '../endpoint/CartEndpoint';
import { AddressRepository } from '../repository/AddressRepository';
import { CartRepository } from '../repository/CartRepository';
import { OrderAddressBuyerRepository } from '../repository/OrderAddressBuyerRepository';
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
  private orderAddressBuyerRepository: OrderAddressBuyerRepository;
  private gmoPaymentService: GMOPaymentService;
  private addressRepository: AddressRepository;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
    orderPaymentRepo: OrderPaymentRepository,
    shipmentRepository: ShipmentRepository,
    orderAddressBuyerRepository: OrderAddressBuyerRepository,
    addressRepository: AddressRepository,
    gmoPaymentService: GMOPaymentService,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
    this.gmoPaymentService = gmoPaymentService;
    this.orderPaymentRepo = orderPaymentRepo;
    this.shipmentRepository = shipmentRepository;
    this.orderAddressBuyerRepository = orderAddressBuyerRepository;
    this.addressRepository = addressRepository;
  }

  public checkFraud = async (type: string, userId: string) => {
    return this.gmoPaymentService.checkFraud(type, userId);
  };

  public entryTran = async (transactionRequest: TransactionRequest) => {
    return await this.gmoPaymentService.entryTran(transactionRequest);
  };

  public execTran = async (
    preExecTransactionRequest: ExecTransactionRequest,
  ) => {
    return await this.gmoPaymentService.execTran(preExecTransactionRequest);
  };

  public createOrder = async (
    cardSeq: string,
    buyerId: string,
    storeId: string,
  ) => {
    // TODO: check fraud
    // Step 1: Shift Events
    Logger.info('Start calculate point');
    // const theFraud = await this.checkFraud(orderCreateRequest.buyerId, '');

    const t = await lpSequelize.transaction();

    try {
      Logger.info('Start create order');
      const createOrderRequest: CreateOrderRequest = {
        orderStatus: OrderStatus.PENDING,
        amount: 0,
        shipmentFee: 0,
        discount: 0,
        totalAmount: 0,
        createdAt: new Date(),
        createdBy: buyerId,
      };
      const order = await this.orderRepo.createOrder(createOrderRequest, t);

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      Logger.info('Start add products from cart to order item');
      const items = await this.cartRepo.getListItemInCart(storeId, buyerId);

      const productsInMyCart = items.map((item) => CartItem.FromLP_CART(item));

      Logger.info(productsInMyCart);
      if (productsInMyCart && productsInMyCart.length <= 0) {
        throw new BadRequestError('Opps, have no any items in your cart');
      }
      const cartItemLength = productsInMyCart.length;
      let totalAmount = 0;
      for (let i = 0; i < cartItemLength; i++) {
        const cartItem = productsInMyCart[i];
        const input = new CreateOrderItemRequest(cartItem);
        input.orderId = order.id;
        await this.orderItemRepo.createOrderItem(input, t);
        if (!input.price || (input.price && input.price <= 0)) {
          Logger.error('Bad price');
          throw new BadRequestError('The price of item must be greater than 0');
        }

        totalAmount += input.price * input.quantity;

        Logger.info('Start delete items from cart');
        await this.cartRepo.deleteItem(cartItem.id, t);
      }

      const shipmentFee =
        totalAmount > ShipmentPrice.MAX_PRICE_APPY_FEE
          ? ShipmentPrice.MIN_FEE
          : ShipmentPrice.MAX_FEE;
      const finalAmount = totalAmount - shipmentFee;

      Logger.info('Start add payment info');
      const oreateOrderPaymentRequest: CreateOrderPaymentRequest = {
        orderId: order.id,
        paymentType: PaymentType.CREDIT_CARD,
        paymentStatus: PaymentSatus.PENDING,
      };
      await this.orderPaymentRepo.createOrderPayment(
        oreateOrderPaymentRequest,
        t,
      );

      Logger.info('Start add shipment info');
      const currentDate = new Date();
      const oreateShipmentRequest: CreateShipmentRequest = {
        orderId: order.id,
        shipmentFee: shipmentFee,
        shipmentFeeDiscount: 0,
        arrivedAt: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
        shipmentBy: '',
        planArrivedFrom: new Date(),
        planArrivedTo: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
      };
      await this.shipmentRepository.createShipment(oreateShipmentRequest, t);

      Logger.info('Insert latest address of buyer');
      const latestAdsress =
        await this.addressRepository.getLatestAddressByBuyerId(buyerId);

      if (!latestAdsress) {
        throw new NotFoundError('Address of buyer is not found');
      }

      const orderAddressBuyer = new OrderAddressBuyerCreate(latestAdsress);
      orderAddressBuyer.orderId = order.id;
      await this.orderAddressBuyerRepository.addAddress(orderAddressBuyer, t);

      Logger.info('Start update order status: CONFIRMED after check point');
      const updateRequest: UpdateOrderStatusRequest = {
        orderId: order.id,
        status: OrderStatus.CONFIRMED,
      };
      this.orderRepo.updateOrderStatus(updateRequest, t);

      Logger.info('Start create transaction');
      // make orderID have length  = 27 match with gmo require
      const orderIDForTran = order.id.substring(0, 27);
      if (finalAmount <= 0) {
        Logger.error('Bad total amount');
        throw new BadRequestError('Your total amount must be greater than 0');
      }
      const transactionRequest: TransactionRequest = {
        orderID: orderIDForTran,
        jobCd: JobCd.CAPTURE,
        amount: finalAmount,
      };
      const theTransInfo = await this.gmoPaymentService.entryTran(
        transactionRequest,
      );
      Logger.info(theTransInfo);

      Logger.info('Start execute transaction');
      if (theTransInfo) {
        const execTransactionRequest: ExecTransactionRequest = {
          accessID: theTransInfo.accessID,
          accessPass: theTransInfo.accessPass,
          memberID: buyerId,
          cardSeq: cardSeq,
          orderID: orderIDForTran,
          method: ChargeMethod.BULK,
        };
        const execTranResponse = await this.gmoPaymentService.execTran(
          execTransactionRequest,
        );

        if (execTranResponse) {
          this.orderRepo.updateOrderStatus(updateRequest, t);

          Logger.info('Start update payment status: PAID');
          await this.orderPaymentRepo.updateOrderPaymentStatus(
            order.id,
            PaymentSatus.PAID,
            t,
          );
        }
      }
      await t.commit();

      // update order
      const updateCreateRequest: UpdateOrderRequest = {
        buyerId: buyerId,
        storeId: storeId,
        orderStatus: OrderStatus.SUCESS,
        amount: totalAmount,
        shipmentFee: shipmentFee,
        discount: 0,
        totalAmount: finalAmount,
        updatedAt: new Date(),
        updatedBy: buyerId,
      };
      const orderUpdated = await this.orderRepo.updateOrder(
        order.id,
        updateCreateRequest,
      );

      return orderUpdated;
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
    buyerId: string,
  ) => {
    let orders: LP_ORDER[] = [];
    orders = await this.orderRepo.getOrders(filter, order, paging, buyerId);
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
