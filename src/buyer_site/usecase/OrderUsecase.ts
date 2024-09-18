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
  DATE_FORMAT,
  JobCd,
  OrderStatus,
  OrderType,
  PaymentSatus,
  PaymentType,
  ProductStatus,
  ShipmentPrice,
  SubscriptionStatus,
} from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import {
  BadRequestError,
  InternalError,
  OutOfStockError,
} from '../../lib/http/custom_error/ApiError';
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
import { isEmpty } from 'lodash';

import {
  CreateSubscriptionAddressRequest,
  SubscriptionAddress,
  SubscriptionProduct,
} from '../../common/model/orders/Subscription';
import moment from 'moment';
import { SubscriptionRepository } from '../repository/SubscriptionRepository';
import { LP_ADDRESS_BUYER } from '../../lib/mysql/models/init-models';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';
import {
  MailService,
  OrderSuccessOptions,
} from '../../third_party/mail/mailService';
import { formatDateJp } from '../../lib/helpers/dateTimeUtil';
import {
  formatCurrency,
  formatPhoneNumber,
} from '../../lib/helpers/commonFunction';

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
  private subscriptionRepo: SubscriptionRepository;
  private mailService: MailService;

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
    subscriptionRepo: SubscriptionRepository,
    mailService: MailService,
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
    this.subscriptionRepo = subscriptionRepo;
    this.mailService = mailService;
  }

  public createOrder = async (
    cardSeq: string,
    buyerId: string,
    storeId: string,
  ) => {
    const cartItems = await this.getCartItems(storeId, buyerId);
    if (isEmpty(cartItems)) {
      throw new BadRequestError('No items in your cart');
    }

    const latestAddress =
      await this.addressRepository.getLatestAddressByBuyerId(buyerId);
    if (!latestAddress) {
      throw new InternalError('Address of buyer is not found');
    }

    const t = await lpSequelize.transaction();
    try {
      let order;
      const normalItems = cartItems.filter((item) => !item.isSubscription);
      if (!isEmpty(normalItems)) {
        order = await this.createNormalOrder({
          cardSeq,
          buyerId,
          storeId,
          cartItems: normalItems,
          latestAddress,
          orderType: OrderType.NORMAL,
          t,
        });
      }

      const subscriptionItems = cartItems.filter((item) => item.isSubscription);
      if (!isEmpty(subscriptionItems)) {
        await this.createSubscription({
          buyerId,
          storeId,
          cartItems: subscriptionItems,
          latestAddress,
          t,
        });
      }

      await t.commit();

      if (order) {
        const orderNewest = await this.orderRepo.getOrderFullAttrById(order.id);
        const products =
          orderNewest?.lpOrderItems?.map((item) => {
            return {
              productName: item.productName,
              unitPrice: formatCurrency(item.price),
              quantity: item.quantity,
              subTotal: formatCurrency((item.price || 0) * item.quantity),
            };
          }) || [];
        const mailOptions: OrderSuccessOptions = {
          to: latestAddress.email,
          subject: 'ECパレット｜ご注文ありがとうございます',
          templateName: 'orderSuccessTemplate',
          params: {
            buyerFirstNameKanji: latestAddress.firstNameKanji,
            buyerLastNameKanji: latestAddress.lastNameKanji,
            companyName: 'ECパレット',
            orderId: order.id,
            orderCreatedAt: formatDateJp(order.createdAt),
            products: products,
            subTotal: formatCurrency(orderNewest?.amount),
            shippingCode: formatCurrency(orderNewest?.shipmentFee),
            total: formatCurrency(orderNewest?.totalAmount),
            postCode: latestAddress.postCode,
            address: `${latestAddress.prefectureName || ''} ${latestAddress.cityTown} ${latestAddress.streetAddress} ${latestAddress.buildingName}`,
            phoneNumber: formatPhoneNumber(latestAddress.telephoneNumber),
          },
        };
        Logger.info(
          `Start send mail order success with options: ${JSON.stringify(mailOptions, null, 2)}`,
        );
        this.mailService.sendMail(mailOptions);
      }
    } catch (error) {
      Logger.error('Fail to create order or subscription');
      Logger.error(error);
      await t.rollback();
      throw error;
    }
  };

  private async createSubscription(params: {
    buyerId: string;
    storeId: string;
    cartItems: CartItem[];
    latestAddress: LP_ADDRESS_BUYER;
    t: Transaction;
  }) {
    const { buyerId, storeId, cartItems, latestAddress, t } = params;
    for (const cartItem of cartItems) {
      Logger.info('Start create subscription');
      const subscription = await this.subscriptionRepo.createSubscription(
        {
          buyerId,
          storeId,
          startDate: moment(cartItem.startBuyingDate, DATE_FORMAT).toDate(),
          nextDate: moment(cartItem.startBuyingDate, DATE_FORMAT).toDate(),
          subscriptionPeriod: cartItem.buyingPeriod || 0,
          subscriptionStatus: SubscriptionStatus.CONTINUE,
        },
        t,
      );

      Logger.info('Start create subscription product');
      await this.subscriptionRepo.createSubscriptionProduct(
        {
          subscriptionId: subscription.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        },
        t,
      );

      Logger.info('Start create subscription address');
      const createSubscriptionAddressRequest =
        new CreateSubscriptionAddressRequest(latestAddress);
      createSubscriptionAddressRequest.subscriptionId = subscription.id;
      await this.subscriptionRepo.createSubscriptionAddress(
        createSubscriptionAddressRequest,
        t,
      );

      Logger.info('Start delete card item');
      await this.cartRepo.deleteItem(cartItem.id, t);
    }
  }

  public async createNormalOrder(params: {
    cardSeq: string;
    buyerId: string;
    storeId: string;
    cartItems: CartItem[] | SubscriptionProduct[];
    latestAddress: LP_ADDRESS_BUYER | SubscriptionAddress;
    orderType: OrderType;
    t: Transaction;
  }) {
    Logger.info('Start create normal order');
    // TODO: check fraud
    // Step 1: Shift Events
    // Logger.info('Start calculate point');
    // const theFraud = await this.gmoPaymentService.checkFraud(type, userId);
    const { cardSeq, buyerId, storeId, cartItems, latestAddress, t } = params;
    const order = await this.initOrder(buyerId, t);
    const totalAmount = await this.processCartItems(cartItems, order.id, t);
    const shipmentFee = this.calculateShipmentFee(totalAmount);
    const finalAmount = totalAmount + shipmentFee;

    await this.createOrderPayment(order.id, t);
    await this.createShipment(order.id, shipmentFee, t);
    await this.createOrderAddressBuyer(order.id, latestAddress, t);

    Logger.info('Start update order status: PREPARING after check point');
    await this.orderRepo.updateOrderStatus(
      {
        orderId: order.id,
        status: OrderStatus.PREPARING,
      },
      t,
    );

    Logger.info('Start create gmo transaction');
    const execTranResponse = await this.processTransaction(
      order.id,
      cardSeq,
      buyerId,
      finalAmount,
    );

    if (execTranResponse) {
      Logger.info('Start update payment status: PAID');
      await this.orderPaymentRepo.updateOrderPaymentStatus(
        order.id,
        PaymentSatus.PAID,
        t,
      );
    }

    return await this.updateOrderAfterTransaction({
      orderId: order.id,
      buyerId,
      storeId,
      totalAmount,
      shipmentFee,
      finalAmount,
      orderStatus: OrderStatus.WAITING_PICKUP,
      t,
    });
  }

  private async initOrder(buyerId: string, t: Transaction): Promise<Order> {
    Logger.info('Start create order');
    let attempts = 0;
    const maxRetries = 10;
    let order;
    while (attempts < maxRetries) {
      const id = Date.now();
      const existingOrder = await this.orderRepo.getOrderById(id);
      if (!existingOrder) {
        const createOrderRequest: CreateOrderRequest = {
          id: id,
          orderStatus: OrderStatus.NOT_CONFIRMED,
          amount: 0,
          shipmentFee: 0,
          discount: 0,
          totalAmount: 0,
          createdAt: new Date(),
          createdBy: buyerId,
        };
        order = await this.orderRepo.createOrder(createOrderRequest, t);
        if (order) {
          attempts = maxRetries;
        }
      }
      attempts++;
    }
    if (!order) {
      throw new InternalError('Order not found');
    }

    return order;
  }

  private async processCartItems(
    cartItems: CartItem[] | SubscriptionProduct[],
    orderId: number,
    t: Transaction,
  ): Promise<number> {
    Logger.info(
      'Start create order item, update stock then delete item in cart',
    );
    let totalAmount = 0;
    for (const cartItem of cartItems) {
      const input = new CreateOrderItemRequest(cartItem);
      input.orderId = orderId;

      if (!input.price || input.price <= 0) {
        Logger.error('Bad price');
        throw new BadRequestError(
          'The price of the item must be greater than 0',
        );
      }

      if (cartItem.product.isDeleted) {
        throw new BadRequestError('Product deleted', ErrorCode.PRODUCT_DELETED);
      }

      if (cartItem.product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestError(
          'Product deactivated',
          ErrorCode.PRODUCT_INACTIVE,
        );
      }

      totalAmount += input.price * input.quantity;
      await this.orderItemRepo.createOrderItem(input, t);
      await this.updateStock(cartItem.productId, cartItem.quantity, t);
      if (cartItem instanceof CartItem) {
        await this.cartRepo.deleteItem(cartItem.id, t);
      }
    }

    return totalAmount;
  }

  private async processTransaction(
    orderId: number,
    cardSeq: string,
    buyerId: string,
    finalAmount: number,
  ) {
    Logger.info('Start create transaction');
    if (finalAmount <= 0) {
      Logger.error('Bad total amount');
      throw new BadRequestError('Your total amount must be greater than 0');
    }
    const transactionRequest: TransactionRequest = {
      orderID: `${orderId}`,
      jobCd: JobCd.CAPTURE,
      amount: finalAmount,
    };
    const theTransInfo =
      await this.gmoPaymentService.entryTran(transactionRequest);
    Logger.info(theTransInfo);

    Logger.info('Start execute transaction');
    if (theTransInfo) {
      const execTransactionRequest: ExecTransactionRequest = {
        accessID: theTransInfo.accessID,
        accessPass: theTransInfo.accessPass,
        memberID: buyerId,
        cardSeq: cardSeq,
        orderID: `${orderId}`,
        method: ChargeMethod.BULK,
      };

      return await this.gmoPaymentService.execTran(execTransactionRequest);
    }
    return null;
  }

  private async getCartItems(storeId: string, buyerId: string) {
    const items = await this.cartRepo.getListItemInCart(storeId, buyerId);
    return items.map((item) => CartItem.FromLP_CART(item));
  }

  private async updateStock(
    productId: string,
    quantity: number,
    t: Transaction,
  ) {
    Logger.info('Start decrease stock item');
    const product = await this.productRepo.getProductById(productId);
    if (!product.stockItem || product.stockItem <= 0) {
      throw new OutOfStockError('This product is not available');
    }

    const newQuantity = product.stockItem - quantity;
    if (newQuantity < 0) {
      throw new OutOfStockError('Exceed maximum stock product');
    }

    await this.productRepo.updateStockProduct(productId, newQuantity, t);
  }

  private calculateShipmentFee(totalAmount: number): number {
    return totalAmount > ShipmentPrice.MAX_PRICE_APPY_FEE
      ? ShipmentPrice.MIN_FEE
      : ShipmentPrice.MAX_FEE;
  }

  private async createOrderPayment(orderId: number, t: Transaction) {
    Logger.info('Start add payment info');
    const currentDate = new Date();
    const createOrderPaymentRequest: CreateOrderPaymentRequest = {
      orderId: orderId,
      paymentType: PaymentType.CREDIT_CARD,
      paymentStatus: PaymentSatus.PENDING,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    await this.orderPaymentRepo.createOrderPayment(
      createOrderPaymentRequest,
      t,
    );
  }

  private async createShipment(
    orderId: number,
    shipmentFee: number,
    t: Transaction,
  ) {
    Logger.info('Start create shipment info');
    const currentDate = new Date();
    const createShipmentRequest: CreateShipmentRequest = {
      orderId: orderId,
      shipmentFee: shipmentFee,
      shipmentFeeDiscount: 0,
      arrivedAt: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
      shipmentBy: '',
      planArrivedFrom: new Date(),
      planArrivedTo: new Date(currentDate.setDate(currentDate.getDate() + 3)), // TODO: need to calculate
    };
    await this.shipmentRepository.createShipment(createShipmentRequest, t);
  }

  private async createOrderAddressBuyer(
    orderId: number,
    latestAddress: LP_ADDRESS_BUYER | SubscriptionAddress,
    t: Transaction,
  ) {
    Logger.info('Insert latest address of buyer');
    const orderAddressBuyer = new OrderAddressBuyerCreate(latestAddress);
    orderAddressBuyer.orderId = orderId;
    await this.orderAddressBuyerRepository.addAddress(orderAddressBuyer, t);
  }

  private async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    t: Transaction,
  ) {
    const updateRequest: UpdateOrderStatusRequest = {
      orderId: orderId,
      status: status,
    };
    await this.orderRepo.updateOrderStatus(updateRequest, t);
  }

  private async updateOrderAfterTransaction(params: {
    orderId: number;
    buyerId: string;
    storeId: string;
    totalAmount: number;
    shipmentFee: number;
    finalAmount: number;
    orderStatus: OrderStatus;
    t: Transaction;
  }): Promise<LP_ORDERAttributes | undefined> {
    const {
      orderId,
      buyerId,
      storeId,
      totalAmount,
      shipmentFee,
      finalAmount,
      orderStatus,
      t,
    } = params;
    const updateCreateRequest: UpdateOrderRequest = {
      buyerId: buyerId,
      storeId: storeId,
      orderStatus: orderStatus,
      amount: totalAmount,
      shipmentFee: shipmentFee,
      discount: 0,
      totalAmount: finalAmount,
      updatedAt: new Date(),
      updatedBy: buyerId,
    };

    return await this.orderRepo.updateOrder(orderId, updateCreateRequest, t);
  }

  public getOrderById = async (id: number) => {
    const result = await this.orderRepo.getOrderById(id);
    return result;
  };

  public getOrders = async (
    filter: Filter[],
    order: LpOrder[],
    paging: Paging,
    buyerId: string,
    storeId: string,
  ) => {
    let orders: LP_ORDER[] = [];
    orders = await this.orderRepo.getOrders(
      filter,
      order,
      paging,
      buyerId,
      storeId,
    );
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
}
