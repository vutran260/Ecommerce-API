import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCTAttributes {
  id: string;
  storeId: string;
  productName?: string;
  productTag?: string;
  productType?: string;
  stock?: string;
  price?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_PRODUCTPk = "id";
export type LP_PRODUCTId = LP_PRODUCT[LP_PRODUCTPk];
export type LP_PRODUCTOptionalAttributes = "id" | "productName" | "productTag" | "productType" | "stock" | "price" | "status" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_PRODUCTCreationAttributes = Optional<LP_PRODUCTAttributes, LP_PRODUCTOptionalAttributes>;

export class LP_PRODUCT extends Model<LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes> implements LP_PRODUCTAttributes {
  id!: string;
  storeId!: string;
  productName?: string;
  productTag?: string;
  productType?: string;
  stock?: string;
  price?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_PRODUCT belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT {
    return LP_PRODUCT.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    storeId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_name'
    },
    productTag: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_tag'
    },
    productType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_type'
    },
    stock: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
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
    tableName: 'LP_PRODUCT',
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
        name: "fk_store_id_product",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
