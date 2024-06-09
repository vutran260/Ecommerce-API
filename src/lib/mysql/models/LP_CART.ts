import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_CARTAttributes {
  id: string;
  buyerId: string;
  storeId: string;
  productId: string;
  quantity: number;
  isSubscription: number;
  buyingPeriod?: number;
  startBuyingDate?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type LP_CARTPk = "id";
export type LP_CARTId = LP_CART[LP_CARTPk];
export type LP_CARTOptionalAttributes = "id" | "buyingPeriod" | "startBuyingDate" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy";
export type LP_CARTCreationAttributes = Optional<LP_CARTAttributes, LP_CARTOptionalAttributes>;

export class LP_CART extends Model<LP_CARTAttributes, LP_CARTCreationAttributes> implements LP_CARTAttributes {
  id!: string;
  buyerId!: string;
  storeId!: string;
  productId!: string;
  quantity!: number;
  isSubscription!: number;
  buyingPeriod?: number;
  startBuyingDate?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  // LP_CART belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_CART belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;
  // LP_CART belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_CART {
    return LP_CART.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_BUYER',
        key: 'id'
      },
      field: 'buyer_id'
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    productId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_PRODUCT',
        key: 'id'
      },
      field: 'product_id'
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    isSubscription: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_subscription'
    },
    buyingPeriod: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      field: 'buying_period'
    },
    startBuyingDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_buying_date'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    createdBy: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'created_by'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    },
    updatedBy: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'updated_by'
    }
  }, {
    sequelize,
    tableName: 'LP_CART',
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
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
  }
}
