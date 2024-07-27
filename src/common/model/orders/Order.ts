import moment from 'moment';
import { DATE_FORMAT } from '../../../../src/lib/constant/Constant';
import { LP_CART } from '../../../../src/lib/mysql/models/LP_CART';
import { LP_ORDER } from '../../../../src/lib/mysql/models/LP_ORDER';
import { LP_ORDER_PAYMENT } from '../../../../src/lib/mysql/models/LP_ORDER_PAYMENT';
import { LP_SHIPMENT } from '../../../../src/lib/mysql/models/LP_SHIPMENT';
import { LP_ORDER_ITEM } from '../../../../src/lib/mysql/models/LP_ORDER_ITEM';

export class Order {
  id: string;
  buyerName?: string;
  totalAmount?: number;
  orderStatus?: string;
  paymentStatus?: string;
  orderDate?: string;
  constructor(order: LP_ORDER) {
    this.id = order.id;
    this.buyerName = order.buyer.username;
    this.totalAmount = order.totalAmount;
    this.orderStatus = order.orderStatus;
    this.paymentStatus = order.lpOrderPayments[0].paymentStatus;
    this.orderDate = moment(order.createdAt).format(DATE_FORMAT);
  }
}

export class OrderItem {
  id: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
  constructor(order: LP_ORDER_ITEM) {
    const priceOfItem = order.price ? order.price : 1;
    this.id = order.id;
    this.productName = order.productName;
    this.productImage = order.productImage;
    this.quantity = order.quantity;
    this.price = priceOfItem;
    this.total = priceOfItem * order.quantity;
  }
}

export class CreateOrderRequest {
  token: string;
  buyerId: string;
  storeId: string;
  receiverId?: string;
  orderStatus?: string;
  amount: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount: number;
  createdAt = new Date();
}

export class UpdateOrderRequest {
  orderStatus?: string;
  amount?: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount?: number;
  updatedAt = new Date();
  updatedBy?: string;
}

export class CreateOrderItemRequest {
  id: string;
  orderId?: string;
  productId?: string;
  productName: string;
  productImage: string;
  productDescription: string;
  productOverview: string;
  price?: number;
  quantity: number;
  createdAt = new Date();
  updatedAt = new Date();
  deletedAt?: Date;

  constructor(cart_item: LP_CART) {
    this.productName =
      cart_item && cart_item.product ? cart_item.product.productName : '';
    this.productImage =
      cart_item && cart_item.product ? cart_item.product.productImage : '';
    this.productDescription =
      cart_item && cart_item.product
        ? cart_item.product.productDescription
        : '';
    this.productOverview =
      cart_item && cart_item.product ? cart_item.product.productOverview : '';

    this.price = cart_item && cart_item.product ? cart_item.product.price : 0;
    this.quantity = cart_item.quantity;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class CreateOrderPaymentRequest {
  orderId?: string;
  paymentType?: string;
  paymentStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(lpOrderPayment: LP_ORDER_PAYMENT) {
    this.orderId = lpOrderPayment.orderId;
    this.paymentType = lpOrderPayment.paymentType;
    this.paymentStatus = lpOrderPayment.paymentStatus;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class CreateShipmentRequest {
  orderId?: string;
  shipmentFee?: number;
  shipmentFeeDiscount?: number;
  arrivedAt?: Date;
  shipmentBy?: string;
  planArrivedFrom?: Date;
  planArrivedTo?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(lpShipment: LP_SHIPMENT) {
    this.orderId = lpShipment.orderId;
    this.shipmentFee = lpShipment.shipmentFee;
    this.shipmentFeeDiscount = lpShipment.shipmentFeeDiscount;
    this.arrivedAt = lpShipment.arrivedAt;
    this.shipmentBy = lpShipment.shipmentBy;
    this.planArrivedFrom = lpShipment.planArrivedFrom;
    this.planArrivedTo = lpShipment.planArrivedTo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class UpdateOrderStatusRequest {
  orderId: string;
  status: string;
}

export class OrderDetailResponse {
  orderCreatedAt?: string;
  orderItems?: [];
  orderNum?: string;
  buyer?: string;
  orderClass?: string;
  orderStatus?: number;
  paymentMethod?: number;
  paymentStatus?: number;

  // shipping info:
  fullname?: string;
  email?: string;
  phone?: string;
  postCode?: string;
  address?: string;
}
