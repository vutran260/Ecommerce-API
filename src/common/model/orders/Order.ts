import moment from 'moment';
import { CartItem } from '../../../buyer_site/endpoint/CartEndpoint';
import { DATE_FORMAT } from '../../../lib/constant/Constant';
import { LP_ADDRESS_BUYER } from '../../../lib/mysql/models/LP_ADDRESS_BUYER';
import { LP_ORDER } from '../../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../../lib/mysql/models/LP_ORDER_ITEM';
import { LP_ORDER_PAYMENT } from '../../../lib/mysql/models/LP_ORDER_PAYMENT';
import { LP_SHIPMENT } from '../../../lib/mysql/models/LP_SHIPMENT';

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
  orderStatus?: string;
  amount: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount: number;
  createdAt = new Date();
  createdBy?: string;
}

export class UpdateOrderRequest {
  buyerId: string;
  storeId: string;
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

  constructor(cartItem: CartItem) {
    const finalItemPrice = cartItem.isSubscription
      ? cartItem.product.calculatedSubscriptionPrice
      : cartItem.product.calculatedNormalPrice;
    this.productId = cartItem.productId;
    this.productName = cartItem.product.productName;
    this.productImage = cartItem.product.productImage.toString();
    this.productDescription = cartItem.product.productDescription;
    this.productOverview = cartItem.product.productOverview;
    this.price = finalItemPrice;
    this.quantity = cartItem.quantity;
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

export class OrderAddressBuyerCreate {
  orderId?: string;
  nameKana: string;
  nameKanji: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(lp_address_buyer: LP_ADDRESS_BUYER) {
    this.nameKana = lp_address_buyer.nameKana;
    this.nameKanji = lp_address_buyer.nameKanji;
    this.postCode = lp_address_buyer.postCode;
    this.cityTown = lp_address_buyer.cityTown;
    this.streetAddress = lp_address_buyer.streetAddress;
    this.buildingName = lp_address_buyer.buildingName;
    this.email = lp_address_buyer.email;
    this.telephoneNumber = lp_address_buyer.telephoneNumber;
    this.createdAt = new Date();
  }
}
