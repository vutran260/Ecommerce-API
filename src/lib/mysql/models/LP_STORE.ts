import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_SELLER, LP_SELLERId } from './LP_SELLER';
import type { LP_STORE_ADDRESS, LP_STORE_ADDRESSId } from './LP_STORE_ADDRESS';
import type { LP_STORE_BUYER, LP_STORE_BUYERId } from './LP_STORE_BUYER';

export interface LP_STOREAttributes {
  id: string;
  contractId: string;
  storeKey?: string;
  storeName?: string;
  storeNameKana?: string;
  companyName: string;
  companyAddress: string;
  owner?: string;
  zipCode?: string;
  phone?: string;
  rejectReason?: string;
  status?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_STOREPk = "id";
export type LP_STOREId = LP_STORE[LP_STOREPk];
export type LP_STOREOptionalAttributes = "id" | "storeKey" | "storeName" | "storeNameKana" | "owner" | "zipCode" | "phone" | "rejectReason" | "status" | "remark" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_STORECreationAttributes = Optional<LP_STOREAttributes, LP_STOREOptionalAttributes>;

export class LP_STORE extends Model<LP_STOREAttributes, LP_STORECreationAttributes> implements LP_STOREAttributes {
  id!: string;
  contractId!: string;
  storeKey?: string;
  storeName?: string;
  storeNameKana?: string;
  companyName!: string;
  companyAddress!: string;
  owner?: string;
  zipCode?: string;
  phone?: string;
  rejectReason?: string;
  status?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_STORE belongsToMany LP_BUYER via storeId and buyerId
  buyerIdLpBuyers!: LP_BUYER[];
  getBuyerIdLpBuyers!: Sequelize.BelongsToManyGetAssociationsMixin<LP_BUYER>;
  setBuyerIdLpBuyers!: Sequelize.BelongsToManySetAssociationsMixin<LP_BUYER, LP_BUYERId>;
  addBuyerIdLpBuyer!: Sequelize.BelongsToManyAddAssociationMixin<LP_BUYER, LP_BUYERId>;
  addBuyerIdLpBuyers!: Sequelize.BelongsToManyAddAssociationsMixin<LP_BUYER, LP_BUYERId>;
  createBuyerIdLpBuyer!: Sequelize.BelongsToManyCreateAssociationMixin<LP_BUYER>;
  removeBuyerIdLpBuyer!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_BUYER, LP_BUYERId>;
  removeBuyerIdLpBuyers!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_BUYER, LP_BUYERId>;
  hasBuyerIdLpBuyer!: Sequelize.BelongsToManyHasAssociationMixin<LP_BUYER, LP_BUYERId>;
  hasBuyerIdLpBuyers!: Sequelize.BelongsToManyHasAssociationsMixin<LP_BUYER, LP_BUYERId>;
  countBuyerIdLpBuyers!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_STORE hasMany LP_CART via storeId
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
  // LP_STORE hasMany LP_CATEGORY via storeId
  lpCategories!: LP_CATEGORY[];
  getLpCategories!: Sequelize.HasManyGetAssociationsMixin<LP_CATEGORY>;
  setLpCategories!: Sequelize.HasManySetAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  addLpCategory!: Sequelize.HasManyAddAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  addLpCategories!: Sequelize.HasManyAddAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  createLpCategory!: Sequelize.HasManyCreateAssociationMixin<LP_CATEGORY>;
  removeLpCategory!: Sequelize.HasManyRemoveAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  removeLpCategories!: Sequelize.HasManyRemoveAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasLpCategory!: Sequelize.HasManyHasAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasLpCategories!: Sequelize.HasManyHasAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  countLpCategories!: Sequelize.HasManyCountAssociationsMixin;
  // LP_STORE hasMany LP_ORDER via storeId
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
  // LP_STORE hasMany LP_PRODUCT via storeId
  lpProducts!: LP_PRODUCT[];
  getLpProducts!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT>;
  setLpProducts!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT, LP_PRODUCTId>;
  addLpProduct!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  addLpProducts!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT, LP_PRODUCTId>;
  createLpProduct!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT>;
  removeLpProduct!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  removeLpProducts!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT, LP_PRODUCTId>;
  hasLpProduct!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  hasLpProducts!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT, LP_PRODUCTId>;
  countLpProducts!: Sequelize.HasManyCountAssociationsMixin;
  // LP_STORE hasMany LP_SELLER via storeId
  lpSellers!: LP_SELLER[];
  getLpSellers!: Sequelize.HasManyGetAssociationsMixin<LP_SELLER>;
  setLpSellers!: Sequelize.HasManySetAssociationsMixin<LP_SELLER, LP_SELLERId>;
  addLpSeller!: Sequelize.HasManyAddAssociationMixin<LP_SELLER, LP_SELLERId>;
  addLpSellers!: Sequelize.HasManyAddAssociationsMixin<LP_SELLER, LP_SELLERId>;
  createLpSeller!: Sequelize.HasManyCreateAssociationMixin<LP_SELLER>;
  removeLpSeller!: Sequelize.HasManyRemoveAssociationMixin<LP_SELLER, LP_SELLERId>;
  removeLpSellers!: Sequelize.HasManyRemoveAssociationsMixin<LP_SELLER, LP_SELLERId>;
  hasLpSeller!: Sequelize.HasManyHasAssociationMixin<LP_SELLER, LP_SELLERId>;
  hasLpSellers!: Sequelize.HasManyHasAssociationsMixin<LP_SELLER, LP_SELLERId>;
  countLpSellers!: Sequelize.HasManyCountAssociationsMixin;
  // LP_STORE hasMany LP_STORE_ADDRESS via storeId
  lpStoreAddresses!: LP_STORE_ADDRESS[];
  getLpStoreAddresses!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_ADDRESS>;
  setLpStoreAddresses!: Sequelize.HasManySetAssociationsMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  addLpStoreAddress!: Sequelize.HasManyAddAssociationMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  addLpStoreAddresses!: Sequelize.HasManyAddAssociationsMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  createLpStoreAddress!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_ADDRESS>;
  removeLpStoreAddress!: Sequelize.HasManyRemoveAssociationMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  removeLpStoreAddresses!: Sequelize.HasManyRemoveAssociationsMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  hasLpStoreAddress!: Sequelize.HasManyHasAssociationMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  hasLpStoreAddresses!: Sequelize.HasManyHasAssociationsMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  countLpStoreAddresses!: Sequelize.HasManyCountAssociationsMixin;
  // LP_STORE hasMany LP_STORE_BUYER via storeId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE {
    return LP_STORE.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    contractId: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: "contract_id",
      field: 'contract_id'
    },
    storeKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "store_key",
      field: 'store_key'
    },
    storeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'store_name'
    },
    storeNameKana: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'store_name_kana'
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'company_name'
    },
    companyAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'company_address'
    },
    owner: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'zip_code'
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rejectReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reject_reason'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
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
    tableName: 'LP_STORE',
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
        name: "contract_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contract_id" },
        ]
      },
      {
        name: "store_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "store_key" },
        ]
      },
    ]
  });
  }
}
