import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId } from './LP_PRODUCT_CATEGORY';
import type { LP_SELLER, LP_SELLERId } from './LP_SELLER';
import type { LP_USER, LP_USERId } from './LP_USER';

export interface LP_STOREAttributes {
  id: string;
  contactId: string;
  prefectureId: string;
  storeKey?: string;
  storeName?: string;
  storeNameKana?: string;
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
  contactId!: string;
  prefectureId!: string;
  storeKey?: string;
  storeName?: string;
  storeNameKana?: string;
  owner?: string;
  zipCode?: string;
  phone?: string;
  rejectReason?: string;
  status?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_STORE hasMany LP_BUYER via storeId
  lpBuyers!: LP_BUYER[];
  getLpBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_BUYER>;
  setLpBuyers!: Sequelize.HasManySetAssociationsMixin<LP_BUYER, LP_BUYERId>;
  addLpBuyer!: Sequelize.HasManyAddAssociationMixin<LP_BUYER, LP_BUYERId>;
  addLpBuyers!: Sequelize.HasManyAddAssociationsMixin<LP_BUYER, LP_BUYERId>;
  createLpBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_BUYER>;
  removeLpBuyer!: Sequelize.HasManyRemoveAssociationMixin<LP_BUYER, LP_BUYERId>;
  removeLpBuyers!: Sequelize.HasManyRemoveAssociationsMixin<LP_BUYER, LP_BUYERId>;
  hasLpBuyer!: Sequelize.HasManyHasAssociationMixin<LP_BUYER, LP_BUYERId>;
  hasLpBuyers!: Sequelize.HasManyHasAssociationsMixin<LP_BUYER, LP_BUYERId>;
  countLpBuyers!: Sequelize.HasManyCountAssociationsMixin;
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
  // LP_STORE hasMany LP_PRODUCT_CATEGORY via storeId
  lpProductCategories!: LP_PRODUCT_CATEGORY[];
  getLpProductCategories!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_CATEGORY>;
  setLpProductCategories!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  addLpProductCategory!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  addLpProductCategories!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  createLpProductCategory!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_CATEGORY>;
  removeLpProductCategory!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  removeLpProductCategories!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  hasLpProductCategory!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  hasLpProductCategories!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  countLpProductCategories!: Sequelize.HasManyCountAssociationsMixin;
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
  // LP_STORE belongsToMany LP_USER via storeId and id
  idLpUsers!: LP_USER[];
  getIdLpUsers!: Sequelize.BelongsToManyGetAssociationsMixin<LP_USER>;
  setIdLpUsers!: Sequelize.BelongsToManySetAssociationsMixin<LP_USER, LP_USERId>;
  addIdLpUser!: Sequelize.BelongsToManyAddAssociationMixin<LP_USER, LP_USERId>;
  addIdLpUsers!: Sequelize.BelongsToManyAddAssociationsMixin<LP_USER, LP_USERId>;
  createIdLpUser!: Sequelize.BelongsToManyCreateAssociationMixin<LP_USER>;
  removeIdLpUser!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_USER, LP_USERId>;
  removeIdLpUsers!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_USER, LP_USERId>;
  hasIdLpUser!: Sequelize.BelongsToManyHasAssociationMixin<LP_USER, LP_USERId>;
  hasIdLpUsers!: Sequelize.BelongsToManyHasAssociationsMixin<LP_USER, LP_USERId>;
  countIdLpUsers!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE {
    return LP_STORE.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    contactId: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: "contact_id",
      field: 'contact_id'
    },
    prefectureId: {
      type: DataTypes.STRING(225),
      allowNull: false,
      field: 'prefecture_id'
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
        name: "contact_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contact_id" },
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
