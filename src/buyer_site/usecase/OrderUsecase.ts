import {
  CreateOrderItemRequest,
  CreateOrderRequest,
  Order,
  UpdateOrderRequest,
} from '../../../src/common/model/orders/Order';
import Logger from '../../../src/lib/core/Logger';
import { lpSequelize } from '../../../src/lib/mysql/Connection';
import { LP_ORDER } from '../../../src/lib/mysql/models/LP_ORDER';
import { LpOrder } from '../../../src/lib/paging/Order';
import { Filter, Paging } from '../../../src/lib/paging/Request';
import { NotFoundError } from '../../lib/http/custom_error/ApiError';
import { CartRepository } from '../repository/CartRepository';
import { OrderItemRepository } from '../repository/OrderItemRepository';
import { OrderRepository } from '../repository/OrderRepository';

export class OrderUsecase {
  private orderRepo: OrderRepository;
  private orderItemRepo: OrderItemRepository;
  private cartRepo: CartRepository;

  constructor(
    orderRepo: OrderRepository,
    orderItemRepo: OrderItemRepository,
    cartRepo: CartRepository,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.cartRepo = cartRepo;
  }

  public async createOrder(orderCreateRequest: CreateOrderRequest) {
    const t = await lpSequelize.transaction();
    try {
      // check point credit card

      // create order after click Proceed to order at Cart screen
      const order = await this.orderRepo.createOrder(orderCreateRequest, t);

      if (order) {
        let totalOrderItemPrice = 0;
        // add products from cart to order-item
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

            // delete cart-item
            await this.cartRepo.deleteItem(cartItem.id);

            // calculate total
            totalOrderItemPrice +=
              cartItem.product.price *
              (cartItem.product.quantity ? cartItem.product.quantity : 1);
          }
          // update order
          const update: UpdateOrderRequest = {
            // shipmentFee: 0,
            totalFee: totalOrderItemPrice,
          };
          await this.orderRepo.updateOrder(order.id, update, t);
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
  }

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
