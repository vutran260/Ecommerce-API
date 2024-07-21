import moment from 'moment';
import { DATE_FORMAT } from '../../../../src/lib/constant/Constant';
import { LP_CART } from '../../../../src/lib/mysql/models/LP_CART';
import { LP_ORDER } from '../../../../src/lib/mysql/models/LP_ORDER';
import { LP_ORDER_PAYMENT } from '../../../../src/lib/mysql/models/LP_ORDER_PAYMENT';
import { LP_SHIPMENT } from '../../../../src/lib/mysql/models/LP_SHIPMENT';

export class Order {
  id: string;
  buyer_name: string;
  total_amount: number;
  order_status: number | null;
  payment_status: number | null;
  order_date: string | null;
  constructor(order: LP_ORDER) {
    this.id = order.id;
    this.buyer_name =
      order && order.buyer && order.buyer.username ? order.buyer.username : '';
    this.total_amount = order && order.totalFee ? order.totalFee : 0;
    this.order_status = order && order.orderStatus ? order.orderStatus : null;
    this.payment_status =
      order &&
      order.lpOrderPayments[0] &&
      order.lpOrderPayments[0].paymentStatus
        ? order.lpOrderPayments[0].paymentStatus
        : null;
    this.order_date =
      order && order.orderCreatedAt
        ? moment(order.orderCreatedAt).format(DATE_FORMAT)
        : null;
  }
}

export class CreateOrderRequest {
  token: string;
  buyerId: string;
  storeId: string;
  orderReceiverId?: string;
  orderShipmentId?: string;
  orderPaymentId?: string;
  orderStatus?: number;
  totalOrderItemFee?: number;
  shipmentFee?: number;
  totalFee?: number;
  orderPaymentDatetime?: Date;
  orderShipmentStartDatetime?: Date;
  orderShipmentEndDatetime?: Date;
  orderCancelDatetime?: Date;
  orderCreatedAt?: Date;
  orderCreatedBy?: string;
  orderUpdatedAt?: Date;
  orderUpdatedBy?: string;
}

export class UpdateOrderRequest {
  orderReceiverId?: string;
  orderShipmentId?: string;
  orderPaymentId?: string;
  orderStatus?: number;
  totalOrderItemFee?: number;
  shipmentFee?: number;
  totalFee?: number;
  orderPaymentDatetime?: Date;
  orderShipmentStartDatetime?: Date;
  orderShipmentEndDatetime?: Date;
  orderCancelDatetime?: Date;
  orderUpdatedAt?: Date;
  orderUpdatedBy?: string;
}

export class CreateOrderItemRequest {
  id: string;
  orderId?: string;
  buyingPeriod?: string;
  isDiscount: number;
  discountPercentage?: number;
  hasDiscountSchedule?: number;
  discountTimeFrom?: Date;
  discountTimeTo?: Date;
  productName: string;
  productImage: string;
  productDescription: string;
  price?: number;
  priceSubscription?: number;
  cost?: number;
  productTag?: string;
  quantity: number;
  capacity?: string;
  expirationUseDate?: Date;
  storageMethod?: string;
  intakeMethod?: string;
  ingredient?: string;
  notificationNumber?: string;
  notification?: string;
  hasOption?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(cart_item: LP_CART) {
    this.buyingPeriod =
      cart_item && cart_item.product ? cart_item.product.buyingPeriod : '';
    this.isDiscount =
      cart_item && cart_item.product && cart_item.product.isDiscount
        ? cart_item.product.isDiscount
        : 0;
    this.discountPercentage =
      cart_item && cart_item.product ? cart_item.product.discountPercentage : 0;
    this.hasDiscountSchedule =
      cart_item && cart_item.product
        ? cart_item.product.hasDiscountSchedule
        : 0;
    this.discountTimeFrom =
      cart_item && cart_item.product
        ? cart_item.product.discountTimeFrom
        : new Date();
    this.discountTimeTo =
      cart_item && cart_item.product
        ? cart_item.product.discountTimeTo
        : new Date();

    this.productName =
      cart_item && cart_item.product ? cart_item.product.productName : '';
    this.productImage =
      cart_item && cart_item.product ? cart_item.product.productImage : '';
    this.productDescription =
      cart_item && cart_item.product
        ? cart_item.product.productDescription
        : '';
    this.price = cart_item && cart_item.product ? cart_item.product.price : 0;
    this.priceSubscription =
      cart_item && cart_item.product ? cart_item.product.priceSubscription : 0;
    this.cost = cart_item && cart_item.product ? cart_item.product.cost : 0;
    this.productTag =
      cart_item && cart_item.product ? cart_item.product.productTag : '';
    this.quantity = cart_item.quantity;
    this.capacity = '';
    this.expirationUseDate = new Date();
    this.storageMethod = '';
    this.intakeMethod = '';
    this.ingredient = '';
    this.notificationNumber = '';
    this.notification = '';
    this.hasOption = 0;
    this.status = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class CreateOrderPaymentRequest {
  orderId?: string;
  paymentType?: number;
  paymentStatus?: number;
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
  shipmentDate?: Date;
  shipmentBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(lpShipment: LP_SHIPMENT) {
    this.orderId = lpShipment.orderId;
    this.shipmentFee = lpShipment.shipmentFee;
    this.shipmentFeeDiscount = lpShipment.shipmentFeeDiscount;
    this.shipmentDate = lpShipment.shipmentDate;
    this.shipmentBy = lpShipment.shipmentBy;
    this.createdAt = new Date();
    this.createdAt = new Date();
  }
}

export class UpdateOrderStatusRequest {
  orderId: string;
  status: number;
}
