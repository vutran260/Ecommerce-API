import {
  CreateOrderItemRequest,
  CreateOrderPaymentRequest,
  CreateOrderRequest,
  CreateShipmentRequest,
  Order,
  OrderAddressBuyerCreate,
  OrderItem,
  UpdateOrderRequest,
} from '../../common/model/orders/Order';
import {
  DATE_FORMAT,
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
  NotFoundError,
  OutOfStockError,
} from '../../lib/http/custom_error/ApiError';
import { lpSequelize } from '../../lib/mysql/Connection';
import { LP_ORDER } from '../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../lib/mysql/models/LP_ORDER_ITEM';
import { LpOrder } from '../../lib/paging/Order';
import { Filter, Paging } from '../../lib/paging/Request';
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
import {
  LP_ADDRESS_BUYER,
  LP_ORDER_CANCEL_REASON,
  LP_PRODUCT,
} from '../../lib/mysql/models/init-models';
import { ErrorCode } from '../../lib/http/custom_error/ErrorCode';
import { PaymentUseCase } from '../../buyer_site/usecase/PaymentUsecase';
import { MailUseCase } from '../../buyer_site/usecase/MailUsecase';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;
  private cartRepo: CartRepository;
  private orderPaymentRepo: OrderPaymentRepository;
  private shipmentRepository: ShipmentRepository;
  private orderAddressBuyerRepository: OrderAddressBuyerRepository;
  private addressRepository: AddressRepository;
  private productRepo: ProductRepository;
  private subscriptionRepo: SubscriptionRepository;
  private paymentUseCase: PaymentUseCase;
  private mailUseCase: MailUseCase;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
    orderPaymentRepo: OrderPaymentRepository,
    shipmentRepository: ShipmentRepository,
    orderAddressBuyerRepository: OrderAddressBuyerRepository,
    addressRepository: AddressRepository,
    productRepo: ProductRepository,
    subscriptionRepo: SubscriptionRepository,
    paymentUseCase: PaymentUseCase,
    mailUseCase: MailUseCase,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
    this.orderPaymentRepo = orderPaymentRepo;
    this.shipmentRepository = shipmentRepository;
    this.orderAddressBuyerRepository = orderAddressBuyerRepository;
    this.addressRepository = addressRepository;
    this.productRepo = productRepo;
    this.subscriptionRepo = subscriptionRepo;
    this.paymentUseCase = paymentUseCase;
    this.mailUseCase = mailUseCase;
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
        this.mailUseCase.sendMailOrder({
          orderId: order.id,
          latestAddress,
        });
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
    const {
      cardSeq,
      buyerId,
      storeId,
      cartItems,
      latestAddress,
      orderType,
      t,
    } = params;
    const order = await this.initOrder(buyerId, orderType, t);
    const totalAmount = await this.processCartItems(
      cartItems,
      order.id,
      orderType,
      t,
    );
    const shipmentFee = this.calculateShipmentFee(totalAmount);
    const finalAmount = totalAmount + shipmentFee;

    await this.createOrderPayment(order.id, t);
    await this.createShipment(order.id, shipmentFee, t);
    await this.createOrderAddressBuyer(order.id, latestAddress, t);

    const orderUpdated = await this.updateOrderInfo({
      orderId: order.id,
      buyerId,
      storeId,
      totalAmount,
      shipmentFee,
      finalAmount,
      orderStatus: OrderStatus.WAITING_CONFIRMED,
      t,
    });

    // if order type is normal, create payment transaction
    // order type is subscription need to be confirmed by seller before transaction
    if (orderType == OrderType.NORMAL && orderUpdated) {
      const res = await this.paymentUseCase.processTransaction({
        order: orderUpdated,
        cardSeq,
      });
      await this.orderPaymentRepo.updateOrderPaymentStatus({
        orderId: order.id,
        status: PaymentSatus.PAID,
        gmoAccessId: res?.accessId || '',
        gmoAccessPass: res?.accessPass || '',
        t,
      });
    }

    return orderUpdated;
  }

  private async initOrder(
    buyerId: string,
    orderType: OrderType,
    t: Transaction,
  ): Promise<Order> {
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
          orderStatus: OrderStatus.WAITING_CONFIRMED,
          orderType: orderType,
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
    orderType: OrderType,
    t: Transaction,
  ): Promise<number> {
    Logger.info(
      'Start create order item, update stock then delete item in cart',
    );
    let totalAmount = 0;
    for (const cartItem of cartItems) {
      const input = new CreateOrderItemRequest(cartItem);
      input.orderId = orderId;
      if (orderType === OrderType.SUBSCRIPTION) {
        input.originalPrice = cartItem.product.priceSubscription || 0;
      } else {
        input.originalPrice = cartItem.product.price;
      }

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

  private async updateOrderInfo(params: {
    orderId: number;
    buyerId: string;
    storeId: string;
    totalAmount: number;
    shipmentFee: number;
    finalAmount: number;
    orderStatus: OrderStatus;
    t: Transaction;
  }): Promise<LP_ORDER | null> {
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
    return await this.orderRepo.getOrderById(id);
  };

  public cancelOrder = async (id: number, reasons: string[]) => {
    Logger.info(`Attempting to cancel order with ID: ${id}`);

    const order = await this.orderRepo.getOrderById(id);
    if (!order) {
      Logger.warn(`Order with ID ${id} not found.`);
      throw new NotFoundError(`Order with ID ${id} not found.`);
    }

    Logger.info(`Order found with ID: ${id}, Status: ${order.orderStatus}`);

    if (
      order.orderStatus !== OrderStatus.WAITING_CONFIRMED &&
      order.orderStatus !== OrderStatus.CONFIRMED_ORDER
    ) {
      Logger.error(
        `Order ID ${id} cannot be canceled. Current status: ${order.orderStatus}`,
      );
      throw new InternalError(
        'ご注文はキャンセルできません。以下の注文状況の場合、キャンセルは承れません：配達中, 配達完了, キャンセル済み, スキップ済み',
      );
    }

    const t = await lpSequelize.transaction();
    try {
      Logger.info(`Starting transaction for canceling order ID: ${id}`);

      await this.orderRepo.updateOrderStatus(
        {
          orderId: id,
          status: OrderStatus.CANCEL,
          currentStatus: order.orderStatus,
        },
        t,
      );
      Logger.info(`Order status updated to CANCEL for order ID: ${id}`);

      await Promise.all(
        reasons.map(async (reason: string) => {
          Logger.info(`Saving cancel reason: ${reason} for order ID: ${id}`);
          await LP_ORDER_CANCEL_REASON.create(
            {
              orderId: id,
              cancelReason: reason,
            },
            {
              transaction: t,
            },
          );
        }),
      );
      Logger.info(`Cancel reasons saved for order ID: ${id}`);

      await this.paymentUseCase.cancelTran(order);
      Logger.info(`Payment transaction canceled for order ID: ${id}`);

      await this.orderPaymentRepo.updateOrderPaymentStatus({
        orderId: id,
        status: PaymentSatus.CANCELLED,
        t,
      });
      Logger.info(
        `Order payment status updated to CANCELLED for order ID: ${id}`,
      );

      const orderItems = await LP_ORDER_ITEM.findAll({
        where: { orderId: id },
        attributes: ['productId', 'quantity'],
        transaction: t,
      });
      Logger.info(`Fetched ${orderItems.length} items for order ID: ${id}`);

      for (const item of orderItems) {
        Logger.info(
          `Incrementing stock for product ID: ${item.productId}, quantity: ${item.quantity}`,
        );
        await LP_PRODUCT.increment(
          { stockItem: item.quantity },
          { where: { id: item.productId }, transaction: t },
        );
      }

      this.mailUseCase.sendMailBuyerCancelOrder({
        order,
        reasons,
        canceledAt: new Date(),
      });
      Logger.info(`Cancellation email sent for order ID: ${id}`);

      await t.commit();
      Logger.info(`Transaction committed for order ID: ${id}`);

      return await this.orderRepo.getOrderById(id);
    } catch (error) {
      Logger.error(`Failed to cancel order ID: ${id}`);
      Logger.error(error);
      await t.rollback();
      Logger.info(`Transaction rolled back for order ID: ${id}`);
      throw error;
    }
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
}
