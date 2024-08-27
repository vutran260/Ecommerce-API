import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type {
  LP_SUBSCRIPTION_ADDRESS,
  LP_SUBSCRIPTION_ADDRESSId,
} from './LP_SUBSCRIPTION_ADDRESS';
import type {
  LP_SUBSCRIPTION_ORDER,
  LP_SUBSCRIPTION_ORDERId,
} from './LP_SUBSCRIPTION_ORDER';
import type {
  LP_SUBSCRIPTION_PRODUCT,
  LP_SUBSCRIPTION_PRODUCTId,
} from './LP_SUBSCRIPTION_PRODUCT';

export interface LP_SUBSCRIPTIONAttributes {
  id: string;
  buyerId: string;
  storeId: string;
  subscriptionStatus: string;
  startDate: Date;
  nextDate: Date;
  planDeliveryTime?: string;
  subscriptionPeriod: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SUBSCRIPTIONPk = 'id';
export type LP_SUBSCRIPTIONId = LP_SUBSCRIPTION[LP_SUBSCRIPTIONPk];
export type LP_SUBSCRIPTIONOptionalAttributes =
  | 'id'
  | 'planDeliveryTime'
  | 'createdAt'
  | 'updatedAt';
export type LP_SUBSCRIPTIONCreationAttributes = Optional<
  LP_SUBSCRIPTIONAttributes,
  LP_SUBSCRIPTIONOptionalAttributes
>;

export class LP_SUBSCRIPTION
  extends Model<LP_SUBSCRIPTIONAttributes, LP_SUBSCRIPTIONCreationAttributes>
  implements LP_SUBSCRIPTIONAttributes
{
  id!: string;
  buyerId!: string;
  storeId!: string;
  subscriptionStatus!: string;
  startDate!: Date;
  nextDate!: Date;
  planDeliveryTime?: string;
  subscriptionPeriod!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SUBSCRIPTION belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_SUBSCRIPTION belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;
  // LP_SUBSCRIPTION belongsToMany LP_ORDER via subscriptionId and orderId
  orderIdLpOrders!: LP_ORDER[];
  getOrderIdLpOrders!: Sequelize.BelongsToManyGetAssociationsMixin<LP_ORDER>;
  setOrderIdLpOrders!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  addOrderIdLpOrder!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  addOrderIdLpOrders!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  createOrderIdLpOrder!: Sequelize.BelongsToManyCreateAssociationMixin<LP_ORDER>;
  removeOrderIdLpOrder!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  removeOrderIdLpOrders!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  hasOrderIdLpOrder!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  hasOrderIdLpOrders!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  countOrderIdLpOrders!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_SUBSCRIPTION belongsToMany LP_PRODUCT via subscriptionId and productId
  productIdLpProductLpSubscriptionProducts!: LP_PRODUCT[];
  getProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManyGetAssociationsMixin<LP_PRODUCT>;
  setProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpSubscriptionProduct!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  createProductIdLpProductLpSubscriptionProduct!: Sequelize.BelongsToManyCreateAssociationMixin<LP_PRODUCT>;
  removeProductIdLpProductLpSubscriptionProduct!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  removeProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpSubscriptionProduct!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  countProductIdLpProductLpSubscriptionProducts!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_SUBSCRIPTION hasOne LP_SUBSCRIPTION_ADDRESS via subscriptionId
  lpSubscriptionAddress!: LP_SUBSCRIPTION_ADDRESS;
  getLpSubscriptionAddress!: Sequelize.HasOneGetAssociationMixin<LP_SUBSCRIPTION_ADDRESS>;
  setLpSubscriptionAddress!: Sequelize.HasOneSetAssociationMixin<
    LP_SUBSCRIPTION_ADDRESS,
    LP_SUBSCRIPTION_ADDRESSId
  >;
  createLpSubscriptionAddress!: Sequelize.HasOneCreateAssociationMixin<LP_SUBSCRIPTION_ADDRESS>;
  // LP_SUBSCRIPTION hasMany LP_SUBSCRIPTION_ORDER via subscriptionId
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
  // LP_SUBSCRIPTION hasMany LP_SUBSCRIPTION_PRODUCT via subscriptionId
  lpSubscriptionProducts!: LP_SUBSCRIPTION_PRODUCT[];
  getLpSubscriptionProducts!: Sequelize.HasManyGetAssociationsMixin<LP_SUBSCRIPTION_PRODUCT>;
  setLpSubscriptionProducts!: Sequelize.HasManySetAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  addLpSubscriptionProduct!: Sequelize.HasManyAddAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  addLpSubscriptionProducts!: Sequelize.HasManyAddAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  createLpSubscriptionProduct!: Sequelize.HasManyCreateAssociationMixin<LP_SUBSCRIPTION_PRODUCT>;
  removeLpSubscriptionProduct!: Sequelize.HasManyRemoveAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  removeLpSubscriptionProducts!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  hasLpSubscriptionProduct!: Sequelize.HasManyHasAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  hasLpSubscriptionProducts!: Sequelize.HasManyHasAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  countLpSubscriptionProducts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SUBSCRIPTION {
    return LP_SUBSCRIPTION.init(
      {
        id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        buyerId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_BUYER',
            key: 'id',
          },
          field: 'buyer_id',
        },
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
        subscriptionStatus: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'subscription_status',
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_date',
        },
        nextDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'next_date',
        },
        planDeliveryTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'plan_delivery_time',
        },
        subscriptionPeriod: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'subscription_period',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_SUBSCRIPTION',
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
