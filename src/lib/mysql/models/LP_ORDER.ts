import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_INVOICE, LP_INVOICEId } from './LP_INVOICE';
import type {
  LP_ORDER_ADDRESS_BUYER,
  LP_ORDER_ADDRESS_BUYERId,
} from './LP_ORDER_ADDRESS_BUYER';
import type {
  LP_ORDER_CANCEL_REASON,
  LP_ORDER_CANCEL_REASONId,
} from './LP_ORDER_CANCEL_REASON';
import type { LP_ORDER_ITEM, LP_ORDER_ITEMId } from './LP_ORDER_ITEM';
import type { LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId } from './LP_ORDER_PAYMENT';
import type { LP_SHIPMENT, LP_SHIPMENTId } from './LP_SHIPMENT';
import type {
  LP_SHIPMENT_HISTORY,
  LP_SHIPMENT_HISTORYId,
} from './LP_SHIPMENT_HISTORY';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';
import type {
  LP_SUBSCRIPTION_ORDER,
  LP_SUBSCRIPTION_ORDERId,
} from './LP_SUBSCRIPTION_ORDER';

export interface LP_ORDERAttributes {
  id: number;
  buyerId?: string;
  storeId?: string;
  orderStatus?: string;
  orderType: string;
  amount: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount: number;
  totalCost: number;
  cancelAt?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type LP_ORDERPk = 'id';
export type LP_ORDERId = LP_ORDER[LP_ORDERPk];
export type LP_ORDEROptionalAttributes =
  | 'buyerId'
  | 'storeId'
  | 'orderStatus'
  | 'orderType'
  | 'shipmentFee'
  | 'discount'
  | 'totalCost'
  | 'cancelAt'
  | 'createdAt'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy';
export type LP_ORDERCreationAttributes = Optional<
  LP_ORDERAttributes,
  LP_ORDEROptionalAttributes
>;

export class LP_ORDER
  extends Model<LP_ORDERAttributes, LP_ORDERCreationAttributes>
  implements LP_ORDERAttributes
{
  id!: number;
  buyerId?: string;
  storeId?: string;
  orderStatus?: string;
  orderType!: string;
  amount!: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount!: number;
  totalCost!: number;
  cancelAt?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  // LP_ORDER belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_ORDER hasMany LP_INVOICE via orderId
  lpInvoices!: LP_INVOICE[];
  getLpInvoices!: Sequelize.HasManyGetAssociationsMixin<LP_INVOICE>;
  setLpInvoices!: Sequelize.HasManySetAssociationsMixin<
    LP_INVOICE,
    LP_INVOICEId
  >;
  addLpInvoice!: Sequelize.HasManyAddAssociationMixin<LP_INVOICE, LP_INVOICEId>;
  addLpInvoices!: Sequelize.HasManyAddAssociationsMixin<
    LP_INVOICE,
    LP_INVOICEId
  >;
  createLpInvoice!: Sequelize.HasManyCreateAssociationMixin<LP_INVOICE>;
  removeLpInvoice!: Sequelize.HasManyRemoveAssociationMixin<
    LP_INVOICE,
    LP_INVOICEId
  >;
  removeLpInvoices!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_INVOICE,
    LP_INVOICEId
  >;
  hasLpInvoice!: Sequelize.HasManyHasAssociationMixin<LP_INVOICE, LP_INVOICEId>;
  hasLpInvoices!: Sequelize.HasManyHasAssociationsMixin<
    LP_INVOICE,
    LP_INVOICEId
  >;
  countLpInvoices!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasOne LP_ORDER_ADDRESS_BUYER via orderId
  lpOrderAddressBuyer!: LP_ORDER_ADDRESS_BUYER;
  getLpOrderAddressBuyer!: Sequelize.HasOneGetAssociationMixin<LP_ORDER_ADDRESS_BUYER>;
  setLpOrderAddressBuyer!: Sequelize.HasOneSetAssociationMixin<
    LP_ORDER_ADDRESS_BUYER,
    LP_ORDER_ADDRESS_BUYERId
  >;
  createLpOrderAddressBuyer!: Sequelize.HasOneCreateAssociationMixin<LP_ORDER_ADDRESS_BUYER>;
  // LP_ORDER hasMany LP_ORDER_CANCEL_REASON via orderId
  lpOrderCancelReasons!: LP_ORDER_CANCEL_REASON[];
  getLpOrderCancelReasons!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER_CANCEL_REASON>;
  setLpOrderCancelReasons!: Sequelize.HasManySetAssociationsMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  addLpOrderCancelReason!: Sequelize.HasManyAddAssociationMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  addLpOrderCancelReasons!: Sequelize.HasManyAddAssociationsMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  createLpOrderCancelReason!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER_CANCEL_REASON>;
  removeLpOrderCancelReason!: Sequelize.HasManyRemoveAssociationMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  removeLpOrderCancelReasons!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  hasLpOrderCancelReason!: Sequelize.HasManyHasAssociationMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  hasLpOrderCancelReasons!: Sequelize.HasManyHasAssociationsMixin<
    LP_ORDER_CANCEL_REASON,
    LP_ORDER_CANCEL_REASONId
  >;
  countLpOrderCancelReasons!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_ORDER_ITEM via orderId
  lpOrderItems!: LP_ORDER_ITEM[];
  getLpOrderItems!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER_ITEM>;
  setLpOrderItems!: Sequelize.HasManySetAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  addLpOrderItem!: Sequelize.HasManyAddAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  addLpOrderItems!: Sequelize.HasManyAddAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  createLpOrderItem!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER_ITEM>;
  removeLpOrderItem!: Sequelize.HasManyRemoveAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  removeLpOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  hasLpOrderItem!: Sequelize.HasManyHasAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  hasLpOrderItems!: Sequelize.HasManyHasAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  countLpOrderItems!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasOne LP_ORDER_PAYMENT via orderId
  lpOrderPayment!: LP_ORDER_PAYMENT;
  getLpOrderPayment!: Sequelize.HasOneGetAssociationMixin<LP_ORDER_PAYMENT>;
  setLpOrderPayment!: Sequelize.HasOneSetAssociationMixin<
    LP_ORDER_PAYMENT,
    LP_ORDER_PAYMENTId
  >;
  createLpOrderPayment!: Sequelize.HasOneCreateAssociationMixin<LP_ORDER_PAYMENT>;
  // LP_ORDER hasOne LP_SHIPMENT via orderId
  lpShipment!: LP_SHIPMENT;
  getLpShipment!: Sequelize.HasOneGetAssociationMixin<LP_SHIPMENT>;
  setLpShipment!: Sequelize.HasOneSetAssociationMixin<
    LP_SHIPMENT,
    LP_SHIPMENTId
  >;
  createLpShipment!: Sequelize.HasOneCreateAssociationMixin<LP_SHIPMENT>;
  // LP_ORDER hasMany LP_SHIPMENT_HISTORY via orderId
  lpShipmentHistories!: LP_SHIPMENT_HISTORY[];
  getLpShipmentHistories!: Sequelize.HasManyGetAssociationsMixin<LP_SHIPMENT_HISTORY>;
  setLpShipmentHistories!: Sequelize.HasManySetAssociationsMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  addLpShipmentHistory!: Sequelize.HasManyAddAssociationMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  addLpShipmentHistories!: Sequelize.HasManyAddAssociationsMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  createLpShipmentHistory!: Sequelize.HasManyCreateAssociationMixin<LP_SHIPMENT_HISTORY>;
  removeLpShipmentHistory!: Sequelize.HasManyRemoveAssociationMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  removeLpShipmentHistories!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  hasLpShipmentHistory!: Sequelize.HasManyHasAssociationMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  hasLpShipmentHistories!: Sequelize.HasManyHasAssociationsMixin<
    LP_SHIPMENT_HISTORY,
    LP_SHIPMENT_HISTORYId
  >;
  countLpShipmentHistories!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER belongsToMany LP_SUBSCRIPTION via orderId and subscriptionId
  subscriptionIdLpSubscriptions!: LP_SUBSCRIPTION[];
  getSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManyGetAssociationsMixin<LP_SUBSCRIPTION>;
  setSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addSubscriptionIdLpSubscription!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createSubscriptionIdLpSubscription!: Sequelize.BelongsToManyCreateAssociationMixin<LP_SUBSCRIPTION>;
  removeSubscriptionIdLpSubscription!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  removeSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasSubscriptionIdLpSubscription!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  countSubscriptionIdLpSubscriptions!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_SUBSCRIPTION_ORDER via orderId
  lpSubscriptionOrders!: LP_SUBSCRIPTION_ORDER[];
  getLpSubscriptionOrders!: Sequelize.HasManyGetAssociationsMixin<LP_SUBSCRIPTION_ORDER>;
  setLpSubscriptionOrders!: Sequelize.HasManySetAssociationsMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  addLpSubscriptionOrder!: Sequelize.HasManyAddAssociationMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  addLpSubscriptionOrders!: Sequelize.HasManyAddAssociationsMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  createLpSubscriptionOrder!: Sequelize.HasManyCreateAssociationMixin<LP_SUBSCRIPTION_ORDER>;
  removeLpSubscriptionOrder!: Sequelize.HasManyRemoveAssociationMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  removeLpSubscriptionOrders!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  hasLpSubscriptionOrder!: Sequelize.HasManyHasAssociationMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  hasLpSubscriptionOrders!: Sequelize.HasManyHasAssociationsMixin<
    LP_SUBSCRIPTION_ORDER,
    LP_SUBSCRIPTION_ORDERId
  >;
  countLpSubscriptionOrders!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER {
    return LP_ORDER.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        buyerId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          references: {
            model: 'LP_BUYER',
            key: 'id',
          },
          field: 'buyer_id',
        },
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
        orderStatus: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'order_status',
        },
        orderType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'NORMAL',
          field: 'order_type',
        },
        amount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        shipmentFee: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'shipment_fee',
        },
        discount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        totalAmount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          field: 'total_amount',
        },
        totalCost: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          comment: 'Total cost',
          field: 'total_cost',
        },
        cancelAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'cancel_at',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'created_at',
        },
        createdBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'created_by',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'updated_at',
        },
        updatedBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'updated_by',
        },
      },
      {
        sequelize,
        tableName: 'LP_ORDER',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'buyer_id',
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }],
          },
          {
            name: 'store_id',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
