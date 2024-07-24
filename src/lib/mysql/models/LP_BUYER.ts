import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId } from './LP_ADDRESS_BUYER';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_STORE_BUYER, LP_STORE_BUYERId } from './LP_STORE_BUYER';

export interface LP_BUYERAttributes {
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_BUYERPk = "id";
export type LP_BUYERId = LP_BUYER[LP_BUYERPk];
export type LP_BUYEROptionalAttributes = "id" | "email" | "phone" | "password" | "username" | "fullname" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_BUYERCreationAttributes = Optional<LP_BUYERAttributes, LP_BUYEROptionalAttributes>;

export class LP_BUYER extends Model<LP_BUYERAttributes, LP_BUYERCreationAttributes> implements LP_BUYERAttributes {
  id!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_BUYER hasMany LP_ADDRESS_BUYER via buyerId
  lpAddressBuyers!: LP_ADDRESS_BUYER[];
  getLpAddressBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_ADDRESS_BUYER>;
  setLpAddressBuyers!: Sequelize.HasManySetAssociationsMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  addLpAddressBuyer!: Sequelize.HasManyAddAssociationMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  addLpAddressBuyers!: Sequelize.HasManyAddAssociationsMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  createLpAddressBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_ADDRESS_BUYER>;
  removeLpAddressBuyer!: Sequelize.HasManyRemoveAssociationMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  removeLpAddressBuyers!: Sequelize.HasManyRemoveAssociationsMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  hasLpAddressBuyer!: Sequelize.HasManyHasAssociationMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  hasLpAddressBuyers!: Sequelize.HasManyHasAssociationsMixin<LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId>;
  countLpAddressBuyers!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_CART via buyerId
  lpCarts!: LP_CART[];
  getLpCarts!: Sequelize.HasManyGetAssociationsMixin<LP_CART>;
  setLpCarts!: Sequelize.HasManySetAssociationsMixin<LP_CART, LP_CARTId>;
  addLpCart!: Sequelize.HasManyAddAssociationMixin<LP_CART, LP_CARTId>;
  addLpCarts!: Sequelize.HasManyAddAssociationsMixin<LP_CART, LP_CARTId>;
  createLpCart!: Sequelize.HasManyCreateAssociationMixin<LP_CART>;
  removeLpCart!: Sequelize.HasManyRemoveAssociationMixin<LP_CART, LP_CARTId>;
  removeLpCarts!: Sequelize.HasManyRemoveAssociationsMixin<LP_CART, LP_CARTId>;
  hasLpCart!: Sequelize.HasManyHasAssociationMixin<LP_CART, LP_CARTId>;
  hasLpCarts!: Sequelize.HasManyHasAssociationsMixin<LP_CART, LP_CARTId>;
  countLpCarts!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_ORDER via buyerId
  lpOrders!: LP_ORDER[];
  getLpOrders!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER>;
  setLpOrders!: Sequelize.HasManySetAssociationsMixin<LP_ORDER, LP_ORDERId>;
  addLpOrder!: Sequelize.HasManyAddAssociationMixin<LP_ORDER, LP_ORDERId>;
  addLpOrders!: Sequelize.HasManyAddAssociationsMixin<LP_ORDER, LP_ORDERId>;
  createLpOrder!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER>;
  removeLpOrder!: Sequelize.HasManyRemoveAssociationMixin<LP_ORDER, LP_ORDERId>;
  removeLpOrders!: Sequelize.HasManyRemoveAssociationsMixin<LP_ORDER, LP_ORDERId>;
  hasLpOrder!: Sequelize.HasManyHasAssociationMixin<LP_ORDER, LP_ORDERId>;
  hasLpOrders!: Sequelize.HasManyHasAssociationsMixin<LP_ORDER, LP_ORDERId>;
  countLpOrders!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER belongsToMany LP_STORE via buyerId and storeId
  storeIdLpStores!: LP_STORE[];
  getStoreIdLpStores!: Sequelize.BelongsToManyGetAssociationsMixin<LP_STORE>;
  setStoreIdLpStores!: Sequelize.BelongsToManySetAssociationsMixin<LP_STORE, LP_STOREId>;
  addStoreIdLpStore!: Sequelize.BelongsToManyAddAssociationMixin<LP_STORE, LP_STOREId>;
  addStoreIdLpStores!: Sequelize.BelongsToManyAddAssociationsMixin<LP_STORE, LP_STOREId>;
  createStoreIdLpStore!: Sequelize.BelongsToManyCreateAssociationMixin<LP_STORE>;
  removeStoreIdLpStore!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_STORE, LP_STOREId>;
  removeStoreIdLpStores!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_STORE, LP_STOREId>;
  hasStoreIdLpStore!: Sequelize.BelongsToManyHasAssociationMixin<LP_STORE, LP_STOREId>;
  hasStoreIdLpStores!: Sequelize.BelongsToManyHasAssociationsMixin<LP_STORE, LP_STOREId>;
  countStoreIdLpStores!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_STORE_BUYER via buyerId
  lpStoreBuyers!: LP_STORE_BUYER[];
  getLpStoreBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_BUYER>;
  setLpStoreBuyers!: Sequelize.HasManySetAssociationsMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  addLpStoreBuyer!: Sequelize.HasManyAddAssociationMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  addLpStoreBuyers!: Sequelize.HasManyAddAssociationsMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  createLpStoreBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_BUYER>;
  removeLpStoreBuyer!: Sequelize.HasManyRemoveAssociationMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  removeLpStoreBuyers!: Sequelize.HasManyRemoveAssociationsMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  hasLpStoreBuyer!: Sequelize.HasManyHasAssociationMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  hasLpStoreBuyers!: Sequelize.HasManyHasAssociationsMixin<LP_STORE_BUYER, LP_STORE_BUYERId>;
  countLpStoreBuyers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_BUYER {
    return LP_BUYER.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_BUYER',
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
    ]
  });
  }
}
