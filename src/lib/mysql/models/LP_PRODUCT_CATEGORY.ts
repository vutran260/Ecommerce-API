import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCT_CATEGORYAttributes {
  storeId: string;
  productId: string;
  categoryId: string;
  createdAt?: Date;
  createdBy?: string;
}

export type LP_PRODUCT_CATEGORYPk = "storeId" | "productId" | "categoryId";
export type LP_PRODUCT_CATEGORYId = LP_PRODUCT_CATEGORY[LP_PRODUCT_CATEGORYPk];
export type LP_PRODUCT_CATEGORYOptionalAttributes = "createdAt" | "createdBy";
export type LP_PRODUCT_CATEGORYCreationAttributes = Optional<LP_PRODUCT_CATEGORYAttributes, LP_PRODUCT_CATEGORYOptionalAttributes>;

export class LP_PRODUCT_CATEGORY extends Model<LP_PRODUCT_CATEGORYAttributes, LP_PRODUCT_CATEGORYCreationAttributes> implements LP_PRODUCT_CATEGORYAttributes {
  storeId!: string;
  productId!: string;
  categoryId!: string;
  createdAt?: Date;
  createdBy?: string;

  // LP_PRODUCT_CATEGORY belongsTo LP_CATEGORY via categoryId
  category!: LP_CATEGORY;
  getCategory!: Sequelize.BelongsToGetAssociationMixin<LP_CATEGORY>;
  setCategory!: Sequelize.BelongsToSetAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  createCategory!: Sequelize.BelongsToCreateAssociationMixin<LP_CATEGORY>;
  // LP_PRODUCT_CATEGORY belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;
  // LP_PRODUCT_CATEGORY belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT_CATEGORY {
    return LP_PRODUCT_CATEGORY.init({
    storeId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    productId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_PRODUCT',
        key: 'id'
      },
      field: 'product_id'
    },
    categoryId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_CATEGORY',
        key: 'id'
      },
      field: 'category_id'
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
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT_CATEGORY',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "store_id" },
          { name: "product_id" },
          { name: "category_id" },
        ]
      },
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "category_id",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  }
}
