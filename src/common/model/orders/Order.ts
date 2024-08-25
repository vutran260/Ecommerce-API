import moment from 'moment';
import { CartItem } from '../../../buyer_site/endpoint/CartEndpoint';
import { DATE_FORMAT } from '../../../lib/constant/Constant';
import { LP_ADDRESS_BUYER } from '../../../lib/mysql/models/LP_ADDRESS_BUYER';
import { LP_ORDER } from '../../../lib/mysql/models/LP_ORDER';
import { LP_ORDER_ITEM } from '../../../lib/mysql/models/LP_ORDER_ITEM';
import { LP_ORDER_PAYMENT } from '../../../lib/mysql/models/LP_ORDER_PAYMENT';
import { LP_SHIPMENT } from '../../../lib/mysql/models/LP_SHIPMENT';
import {
  SubscriptionAddress,
  SubscriptionProduct,
} from '../../../common/model/orders/Subscription';

export class Order {
  id: number;
  buyerName?: string;
  totalAmount?: number;
  orderStatus?: string;
  paymentStatus?: string;
  orderDate?: string;
  orderItems?: OrderItem[];
  constructor(order: LP_ORDER) {
    this.id = order.id;
    this.buyerName = order.buyer.username;
    this.totalAmount = order.totalAmount;
    this.orderStatus = order.orderStatus;
    this.paymentStatus = order.lpOrderPayment.paymentStatus;
    this.orderDate = moment(order.createdAt).format(DATE_FORMAT);
    this.orderItems = order.lpOrderItems?.map((lpOrderItem) => {
      return new OrderItem(lpOrderItem);
    });
  }
}

export class OrderItem {
  id: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
  constructor(order: LP_ORDER_ITEM) {
    const priceOfItem = order.price ? order.price : 1;
    this.id = order.id;
    this.productId = order.productId;
    this.productName = order.productName;
    this.productImage = order.productImage;
    this.quantity = order.quantity;
    this.price = priceOfItem;
    this.total = priceOfItem * order.quantity;
  }
}

export class CreateOrderRequest {
  id: number;
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
  orderId?: number;
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

  constructor(cartItem: CartItem | SubscriptionProduct) {
    const finalItemPrice =
      cartItem instanceof SubscriptionProduct
        ? cartItem.product.calculatedSubscriptionPrice
        : cartItem.product.calculatedNormalPrice;
    this.productId = cartItem.productId;
    this.productName = cartItem.product.productName;
    this.productImage = cartItem.product.productImage?.toString();
    this.productDescription = cartItem.product.productDescription;
    this.productOverview = cartItem.product.productOverview;
    this.price = finalItemPrice;
    this.quantity = cartItem.quantity;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class CreateOrderPaymentRequest {
  orderId: number;
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
  orderId: number;
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
  orderId: number;
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
  orderId: number;
  firstNameKana: string;
  lastNameKana: string;
  firstNameKanji: string;
  lastNameKanji: string;
  gender?: number;
  prefectureCode: string;
  agreed?: number;
  keepContact?: number;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(lp_address_buyer: LP_ADDRESS_BUYER | SubscriptionAddress) {
    this.firstNameKana = lp_address_buyer.firstNameKana;
    this.lastNameKana = lp_address_buyer.lastNameKana;
    this.firstNameKanji = lp_address_buyer.firstNameKanji;
    this.lastNameKanji = lp_address_buyer.lastNameKanji;
    this.gender = lp_address_buyer.gender;
    this.prefectureCode = lp_address_buyer.prefectureCode;
    if (lp_address_buyer instanceof LP_ADDRESS_BUYER) {
      this.agreed = lp_address_buyer.agreed;
      this.keepContact = lp_address_buyer.keepContact;
    }
    this.postCode = lp_address_buyer.postCode;
    this.cityTown = lp_address_buyer.cityTown;
    this.streetAddress = lp_address_buyer.streetAddress;
    this.buildingName = lp_address_buyer.buildingName;
    this.email = lp_address_buyer.email;
    this.telephoneNumber = lp_address_buyer.telephoneNumber;
    this.createdAt = new Date();
  }
}
