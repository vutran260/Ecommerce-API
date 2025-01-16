import { OrderStatus, OrderType } from '../../lib/constant/Constant';
import Logger from '../../lib/core/Logger';
import {
  BadRequestError,
  InternalError,
} from '../../lib/http/custom_error/ApiError';
import { lpSequelize } from '../../lib/mysql/Connection';
import { CartItem } from '../endpoint/CartEndpoint';
import { AddressRepository } from '../repository/AddressRepository';
import { Transaction } from 'sequelize';
import { isEmpty } from 'lodash';
import {
  SubscriptionAddress,
  SubscriptionProduct,
} from '../../common/model/orders/Subscription';
import { LP_ADDRESS_BUYER } from '../../lib/mysql/models/init-models';
import { ShipmentUseCase } from '../usecase/ShipmentUseCase';
import { PointHistoryUseCase } from '../usecase/PointHistoryUsecase';
import { RequestPointStatus } from '../../lib/constant/point/RequestPointStatus';
import { OrderUsecase } from '../usecase/OrderUsecase';
import { CartRepository } from '../repository/CartRepository';

export class OrderSpecialUsecase {
  private addressRepository: AddressRepository;
  private shipmentUseCase: ShipmentUseCase;
  private pointHistoryUseCase: PointHistoryUseCase;
  private cartRepo: CartRepository;
  private orderUsecase: OrderUsecase;

  constructor(
    addressRepository: AddressRepository,
    shipmentUseCase: ShipmentUseCase,
    pointHistoryUseCase: PointHistoryUseCase,
    cartRepo: CartRepository,
    orderUsecase: OrderUsecase,
  ) {
    this.addressRepository = addressRepository;
    this.shipmentUseCase = shipmentUseCase;
    this.pointHistoryUseCase = pointHistoryUseCase;
    this.cartRepo = cartRepo;
    this.orderUsecase = orderUsecase;
  }

  public createOrder = async (buyerId: string, storeId: string) => {
    const specialCartItems = await this.getSpecialCartItems(storeId, buyerId);
    if (isEmpty(specialCartItems)) {
      throw new BadRequestError('No items in your cart');
    }

    const latestAddress =
      await this.addressRepository.getLatestAddressByBuyerId(buyerId);
    if (!latestAddress) {
      throw new InternalError('Address of buyer is not found');
    }

    const t = await lpSequelize.transaction();
    try {
      await this.createSpecialOrder({
        buyerId,
        storeId,
        cartItems: specialCartItems,
        latestAddress,
        orderType: OrderType.NORMAL,
        t,
      });
      await t.commit();
    } catch (error) {
      Logger.error('Fail to create special order');
      Logger.error(error);
      await t.rollback();
      throw error;
    }
  };

  public async createSpecialOrder(params: {
    buyerId: string;
    storeId: string;
    cartItems: CartItem[] | SubscriptionProduct[];
    latestAddress: LP_ADDRESS_BUYER | SubscriptionAddress;
    orderType: OrderType;
    pointRate?: number;
    t: Transaction;
  }) {
    Logger.info('Start create special order');
    const {
      buyerId,
      storeId,
      cartItems,
      latestAddress,
      orderType,
      pointRate = 1,
      t,
    } = params;
    const order = await this.orderUsecase.initOrder({
      buyerId: buyerId,
      orderType: orderType,
      orderStatus: OrderStatus.WAITING_APPROVED,
      t,
    });
    const totalAmount = await this.orderUsecase.processCartItems({
      cartItems: cartItems,
      orderId: order.id,
      orderType: orderType,
      isSkippedOrder: false,
      t,
    });
    const shipmentFee = this.shipmentUseCase.calculateShipmentFee({
      totalAmount,
    });
    const pointHistory = await this.pointHistoryUseCase.updatePointHistory({
      buyerId: buyerId,
      storeId: storeId,
      orderId: order.id,
      requestStatus: RequestPointStatus.APPROVED,
      t,
    });
    const pointUse = pointHistory?.requestPoint || 0;
    const finalAmount = totalAmount + shipmentFee - pointUse;
    const pointReceive = this.pointHistoryUseCase.calculatePoint(
      finalAmount,
      pointRate,
    );

    await this.orderUsecase.createOrderPayment(order.id, t);
    await this.orderUsecase.createShipment(order.id, shipmentFee, t);
    await this.orderUsecase.createOrderAddressBuyer(order.id, latestAddress, t);

    return await this.orderUsecase.updateOrderInfo({
      orderId: order.id,
      buyerId,
      storeId,
      totalAmount,
      shipmentFee,
      pointUse,
      pointReceive,
      finalAmount,
      orderStatus: OrderStatus.WAITING_APPROVED,
      t,
    });
  }

  public async getSpecialCartItems(storeId: string, buyerId: string) {
    const items = await this.cartRepo.getSpecialItemInCart(storeId, buyerId);
    return items.map((item) => CartItem.FromLP_CART(item));
  }
}
