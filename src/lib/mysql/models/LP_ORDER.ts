import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type {
  LP_ORDER_ADDRESS_BUYER,
  LP_ORDER_ADDRESS_BUYERCreationAttributes,
  LP_ORDER_ADDRESS_BUYERId,
} from './LP_ORDER_ADDRESS_BUYER';
import type { LP_ORDER_ITEM, LP_ORDER_ITEMId } from './LP_ORDER_ITEM';
import type {
  LP_ORDER_PAYMENT,
  LP_ORDER_PAYMENTCreationAttributes,
  LP_ORDER_PAYMENTId,
} from './LP_ORDER_PAYMENT';
import type {
  LP_SHIPMENT,
  LP_SHIPMENTCreationAttributes,
  LP_SHIPMENTId,
} from './LP_SHIPMENT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_ORDERAttributes {
  id: string;
  buyerId?: string;
  storeId?: string;
  orderStatus?: string;
  amount: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount: number;
  cancelAt?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type LP_ORDERPk = 'id';
export type LP_ORDERId = LP_ORDER[LP_ORDERPk];
export type LP_ORDEROptionalAttributes =
  | 'id'
  | 'buyerId'
  | 'storeId'
  | 'orderStatus'
  | 'shipmentFee'
  | 'discount'
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
  id!: string;
  buyerId?: string;
  storeId?: string;
  orderStatus?: string;
  amount!: number;
  shipmentFee?: number;
  discount?: number;
  totalAmount!: number;
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
  // LP_ORDER hasOne LP_ORDER_ADDRESS_BUYER via orderId
  lpOrderAddressBuyer!: LP_ORDER_ADDRESS_BUYER;
  getLpOrderAddressBuyer!: Sequelize.HasOneGetAssociationMixin<LP_ORDER_ADDRESS_BUYER>;
  setLpOrderAddressBuyer!: Sequelize.HasOneSetAssociationMixin<
    LP_ORDER_ADDRESS_BUYER,
    LP_ORDER_ADDRESS_BUYERId
  >;
  createLpOrderAddressBuyer!: Sequelize.HasOneCreateAssociationMixin<LP_ORDER_ADDRESS_BUYER>;
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
  // LP_ORDER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER {
    return LP_ORDER.init(
      {
        id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
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
