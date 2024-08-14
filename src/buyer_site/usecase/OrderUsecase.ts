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
import { BadRequestError, NotFoundError } from '../../lib/http/custom_error/ApiError';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_ORDER, LP_ORDERAttributes } from '../../lib/mysql/models/LP_ORDER';
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
import { ProductRepository } from '../repository/ProductRepository';
import { ShipmentRepository } from '../repository/ShipmentRepository';
import { Transaction } from 'sequelize';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;
  private cartRepo: CartRepository;
  private orderPaymentRepo: OrderPaymentRepository;
  private shipmentRepository: ShipmentRepository;
  private orderAddressBuyerRepository: OrderAddressBuyerRepository;
  private gmoPaymentService: GMOPaymentService;
  private addressRepository: AddressRepository;
  private productRepo: ProductRepository;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
    orderPaymentRepo: OrderPaymentRepository,
    shipmentRepository: ShipmentRepository,
    orderAddressBuyerRepository: OrderAddressBuyerRepository,
    addressRepository: AddressRepository,
    gmoPaymentService: GMOPaymentService,
    productRepo: ProductRepository,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
    this.gmoPaymentService = gmoPaymentService;
    this.orderPaymentRepo = orderPaymentRepo;
    this.shipmentRepository = shipmentRepository;
    this.orderAddressBuyerRepository = orderAddressBuyerRepository;
    this.addressRepository = addressRepository;
    this.productRepo = productRepo;
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
    // Logger.info('Start calculate point');
    // const theFraud = await this.checkFraud(orderCreateRequest.buyerId, '');

    const t = await lpSequelize.transaction();

    try {
      Logger.info('Start create order');
      const order = await this.createNewOrder(buyerId, t);

      Logger.info('Start add payment info');
      await this.addPaymentInfo(order.id, t);

      Logger.info('Start add products from cart to order item');
      const totalAmount = await this.processCartItems(storeId, buyerId, order.id, t);
      const shipmentFee = this.calculateShipmentFee(totalAmount);

      Logger.info('Start add shipment info');
      await this.addShipmentInfo(order.id, shipmentFee, t);

      Logger.info('Insert latest address of buyer');
      await this.insertLatestBuyerAddress(order.id, buyerId, t);

      Logger.info('Start update order status: CONFIRMED after check point');
      await this.updateOrderStatus(order.id, OrderStatus.PREPARING, t);

      Logger.info('Start create transaction');
      const finalAmount = totalAmount + shipmentFee;
      const execTranResponse = await this.processTransaction(
        order.id,
        cardSeq,
        buyerId,
        finalAmount
      );

      if (execTranResponse) {
        Logger.info('Start update payment status: PAID');
        await this.orderPaymentRepo.updateOrderPaymentStatus(
          order.id,
          PaymentSatus.PAID,
          t
        );
      }

      const orderUpdated = await this.updateOrder(
        order.id,
        buyerId,
        storeId,
        totalAmount,
        shipmentFee,
        finalAmount,
        t
      );

      await t.commit();

      return orderUpdated;
    } catch (error) {
      await t.rollback();
      Logger.error('Fail to create order');
      Logger.error(error);
      throw error;
    }
  };

  private async createNewOrder(
    buyerId: string,
    t: Transaction
  ): Promise<Order> {
    const createOrderRequest: CreateOrderRequest = {
      orderStatus: OrderStatus.NOT_CONFIRMED,
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

    return order;
  }

  private async processCartItems(
    storeId: string,
    buyerId: string,
    orderId: string,
    t: Transaction
  ): Promise<number> {

    const productsInMyCart = await this.getCartItems(storeId, buyerId);
    if (!productsInMyCart || productsInMyCart.length <= 0) {
      throw new BadRequestError('No items in your cart');
    }

    let totalAmount = 0;
    for (const cartItem of productsInMyCart) {
      const input = new CreateOrderItemRequest(cartItem);
      input.orderId = orderId;

      if (!input.price || input.price <= 0) {
        Logger.error('Bad price');
        throw new BadRequestError('The price of the item must be greater than 0');
      }

      totalAmount += input.price * input.quantity;
      await this.orderItemRepo.createOrderItem(input, t);
      await this.updateStock(cartItem.productId, cartItem.quantity, t);
      await this.cartRepo.deleteItem(cartItem.id, t);
    }

    return totalAmount;
  }

  private async processTransaction(
    orderId: string,
    cardSeq: string,
    buyerId: string,
    finalAmount: number
  ) {
    Logger.info('Start create transaction');
    // make orderID have length  = 27 match with gmo require
    const orderIDForTran = orderId.substring(0, 27);
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

      return await this.gmoPaymentService.execTran(
        execTransactionRequest,
      );
    }

    return null;
  }

  private async getCartItems(storeId: string, buyerId: string) {
    const items = await this.cartRepo.getListItemInCart(storeId, buyerId);
    return items.map((item) => CartItem.FromLP_CART(item));
  }

  private async updateStock(productId: string, quantity: number, t: Transaction) {
    Logger.info('Start decrease stock item');
    const product = await this.productRepo.getProductById(productId);
    if (!product.stockItem || product.stockItem <= 0) {
      throw new BadRequestError('This product is not available');
    }

    const newQuantity = product.stockItem - quantity;
    if (newQuantity < 0) {
      throw new BadRequestError('Exceed maximum stock product');
    }

    await this.productRepo.updateStockProduct(productId, newQuantity, t);
  }

  private calculateShipmentFee(totalAmount: number): number {
    return totalAmount > ShipmentPrice.MAX_PRICE_APPY_FEE
      ? ShipmentPrice.MIN_FEE
      : ShipmentPrice.MAX_FEE;
  }

  private async addPaymentInfo(orderId: string, t: Transaction) {
    const createOrderPaymentRequest: CreateOrderPaymentRequest = {
      orderId: orderId,
      paymentType: PaymentType.CREDIT_CARD,
      paymentStatus: PaymentSatus.PENDING,
    };
    await this.orderPaymentRepo.createOrderPayment(createOrderPaymentRequest, t);
  }

  private async addShipmentInfo(orderId: string, shipmentFee: number, t: Transaction) {
    const currentDate = new Date();
    const oreateShipmentRequest: CreateShipmentRequest = {
      orderId: orderId,
      shipmentFee: shipmentFee,
      shipmentFeeDiscount: 0,
      arrivedAt: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
      shipmentBy: '',
      planArrivedFrom: new Date(),
      planArrivedTo: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
    };
    await this.shipmentRepository.createShipment(oreateShipmentRequest, t);
  }

  private async insertLatestBuyerAddress(orderId: string, buyerId: string, t: Transaction) {
    const latestAddress =
      await this.addressRepository.getLatestAddressByBuyerId(buyerId);

    if (!latestAddress) {
      throw new NotFoundError('Address of buyer is not found');
    }

    const orderAddressBuyer = new OrderAddressBuyerCreate(latestAddress);
    orderAddressBuyer.orderId = orderId;
    await this.orderAddressBuyerRepository.addAddress(orderAddressBuyer, t);
  }

  private async updateOrderStatus(orderId: string, status: OrderStatus, t: Transaction) {
    const updateRequest: UpdateOrderStatusRequest = {
      orderId: orderId,
      status: status,
    };
    await this.orderRepo.updateOrderStatus(updateRequest, t);
  }

  private async updateOrder(
    orderId: string,
    buyerId: string,
    storeId: string,
    totalAmount: number,
    shipmentFee: number,
    finalAmount: number,
    t: Transaction
  ): Promise<LP_ORDERAttributes | undefined> {
    const updateCreateRequest: UpdateOrderRequest = {
      buyerId: buyerId,
      storeId: storeId,
      orderStatus: OrderStatus.WAITING_PICKUP,
      amount: totalAmount,
      shipmentFee: shipmentFee,
      discount: 0,
      totalAmount: finalAmount,
      updatedAt: new Date(),
      updatedBy: buyerId,
    };

    return await this.orderRepo.updateOrder(
      orderId,
      updateCreateRequest,
      t,
    );
  }

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
