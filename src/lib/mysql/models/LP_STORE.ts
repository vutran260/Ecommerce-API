import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId } from './LP_ADDRESS_BUYER';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_SELLER, LP_SELLERId } from './LP_SELLER';
import type { LP_STORE_BUYER, LP_STORE_BUYERId } from './LP_STORE_BUYER';
import type { LP_STORE_POST, LP_STORE_POSTId } from './LP_STORE_POST';

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

  // LP_STORE hasMany LP_ADDRESS_BUYER via storeId
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
  // LP_STORE hasMany LP_STORE_POST via storeId
  lpStorePosts!: LP_STORE_POST[];
  getLpStorePosts!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_POST>;
  setLpStorePosts!: Sequelize.HasManySetAssociationsMixin<LP_STORE_POST, LP_STORE_POSTId>;
  addLpStorePost!: Sequelize.HasManyAddAssociationMixin<LP_STORE_POST, LP_STORE_POSTId>;
  addLpStorePosts!: Sequelize.HasManyAddAssociationsMixin<LP_STORE_POST, LP_STORE_POSTId>;
  createLpStorePost!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_POST>;
  removeLpStorePost!: Sequelize.HasManyRemoveAssociationMixin<LP_STORE_POST, LP_STORE_POSTId>;
  removeLpStorePosts!: Sequelize.HasManyRemoveAssociationsMixin<LP_STORE_POST, LP_STORE_POSTId>;
  hasLpStorePost!: Sequelize.HasManyHasAssociationMixin<LP_STORE_POST, LP_STORE_POSTId>;
  hasLpStorePosts!: Sequelize.HasManyHasAssociationsMixin<LP_STORE_POST, LP_STORE_POSTId>;
  countLpStorePosts!: Sequelize.HasManyCountAssociationsMixin;

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
