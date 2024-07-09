import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId } from './LP_ITEM_SUBSCRIPTION';
import type { LP_ORDER_ITEM, LP_ORDER_ITEMId } from './LP_ORDER_ITEM';
import type { LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId } from './LP_ORDER_PAYMENT';
import type { LP_SHIPMENT, LP_SHIPMENTId } from './LP_SHIPMENT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId } from './LP_STORE_PICKUP_ADDRESS';

export interface LP_ORDERAttributes {
  id: string;
  buyerId?: string;
  storeId?: string;
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

export type LP_ORDERPk = "id";
export type LP_ORDERId = LP_ORDER[LP_ORDERPk];
export type LP_ORDEROptionalAttributes = "id" | "buyerId" | "storeId" | "orderReceiverId" | "orderShipmentId" | "orderPaymentId" | "orderStatus" | "totalOrderItemFee" | "shipmentFee" | "totalFee" | "orderPaymentDatetime" | "orderShipmentStartDatetime" | "orderShipmentEndDatetime" | "orderCancelDatetime" | "orderCreatedAt" | "orderCreatedBy" | "orderUpdatedAt" | "orderUpdatedBy";
export type LP_ORDERCreationAttributes = Optional<LP_ORDERAttributes, LP_ORDEROptionalAttributes>;

export class LP_ORDER extends Model<LP_ORDERAttributes, LP_ORDERCreationAttributes> implements LP_ORDERAttributes {
  id!: string;
  buyerId?: string;
  storeId?: string;
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

  // LP_ORDER belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_ORDER hasMany LP_ITEM_SUBSCRIPTION via orderId
  lpItemSubscriptions!: LP_ITEM_SUBSCRIPTION[];
  getLpItemSubscriptions!: Sequelize.HasManyGetAssociationsMixin<LP_ITEM_SUBSCRIPTION>;
  setLpItemSubscriptions!: Sequelize.HasManySetAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  addLpItemSubscription!: Sequelize.HasManyAddAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  addLpItemSubscriptions!: Sequelize.HasManyAddAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  createLpItemSubscription!: Sequelize.HasManyCreateAssociationMixin<LP_ITEM_SUBSCRIPTION>;
  removeLpItemSubscription!: Sequelize.HasManyRemoveAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  removeLpItemSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  hasLpItemSubscription!: Sequelize.HasManyHasAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  hasLpItemSubscriptions!: Sequelize.HasManyHasAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  countLpItemSubscriptions!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_ORDER_ITEM via orderId
  lpOrderItems!: LP_ORDER_ITEM[];
  getLpOrderItems!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER_ITEM>;
  setLpOrderItems!: Sequelize.HasManySetAssociationsMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  addLpOrderItem!: Sequelize.HasManyAddAssociationMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  addLpOrderItems!: Sequelize.HasManyAddAssociationsMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  createLpOrderItem!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER_ITEM>;
  removeLpOrderItem!: Sequelize.HasManyRemoveAssociationMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  removeLpOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  hasLpOrderItem!: Sequelize.HasManyHasAssociationMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  hasLpOrderItems!: Sequelize.HasManyHasAssociationsMixin<LP_ORDER_ITEM, LP_ORDER_ITEMId>;
  countLpOrderItems!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_ORDER_PAYMENT via orderId
  lpOrderPayments!: LP_ORDER_PAYMENT[];
  getLpOrderPayments!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER_PAYMENT>;
  setLpOrderPayments!: Sequelize.HasManySetAssociationsMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  addLpOrderPayment!: Sequelize.HasManyAddAssociationMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  addLpOrderPayments!: Sequelize.HasManyAddAssociationsMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  createLpOrderPayment!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER_PAYMENT>;
  removeLpOrderPayment!: Sequelize.HasManyRemoveAssociationMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  removeLpOrderPayments!: Sequelize.HasManyRemoveAssociationsMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  hasLpOrderPayment!: Sequelize.HasManyHasAssociationMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  hasLpOrderPayments!: Sequelize.HasManyHasAssociationsMixin<LP_ORDER_PAYMENT, LP_ORDER_PAYMENTId>;
  countLpOrderPayments!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_SHIPMENT via orderId
  lpShipments!: LP_SHIPMENT[];
  getLpShipments!: Sequelize.HasManyGetAssociationsMixin<LP_SHIPMENT>;
  setLpShipments!: Sequelize.HasManySetAssociationsMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  addLpShipment!: Sequelize.HasManyAddAssociationMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  addLpShipments!: Sequelize.HasManyAddAssociationsMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  createLpShipment!: Sequelize.HasManyCreateAssociationMixin<LP_SHIPMENT>;
  removeLpShipment!: Sequelize.HasManyRemoveAssociationMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  removeLpShipments!: Sequelize.HasManyRemoveAssociationsMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  hasLpShipment!: Sequelize.HasManyHasAssociationMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  hasLpShipments!: Sequelize.HasManyHasAssociationsMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  countLpShipments!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER hasMany LP_STORE_PICKUP_ADDRESS via orderId
  lpStorePickupAddresses!: LP_STORE_PICKUP_ADDRESS[];
  getLpStorePickupAddresses!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_PICKUP_ADDRESS>;
  setLpStorePickupAddresses!: Sequelize.HasManySetAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  addLpStorePickupAddress!: Sequelize.HasManyAddAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  addLpStorePickupAddresses!: Sequelize.HasManyAddAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  createLpStorePickupAddress!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_PICKUP_ADDRESS>;
  removeLpStorePickupAddress!: Sequelize.HasManyRemoveAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  removeLpStorePickupAddresses!: Sequelize.HasManyRemoveAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  hasLpStorePickupAddress!: Sequelize.HasManyHasAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  hasLpStorePickupAddresses!: Sequelize.HasManyHasAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  countLpStorePickupAddresses!: Sequelize.HasManyCountAssociationsMixin;
  // LP_ORDER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER {
    return LP_ORDER.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_BUYER',
        key: 'id'
      },
      field: 'buyer_id'
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    orderReceiverId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'order_receiver_id'
    },
    orderShipmentId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'order_shipment_id'
    },
    orderPaymentId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'order_payment_id'
    },
    orderStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'order_status'
    },
    totalOrderItemFee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'total_order_item_fee'
    },
    shipmentFee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'shipment_fee'
    },
    totalFee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'total_fee'
    },
    orderPaymentDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_payment_datetime'
    },
    orderShipmentStartDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_shipment_start_datetime'
    },
    orderShipmentEndDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_shipment_end_datetime'
    },
    orderCancelDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_cancel_datetime'
    },
    orderCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_created_at'
    },
    orderCreatedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'order_created_by'
    },
    orderUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'order_updated_at'
    },
    orderUpdatedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'order_updated_by'
    }
  }, {
    sequelize,
    tableName: 'LP_ORDER',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "buyer_id",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
      {
        name: "store_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
