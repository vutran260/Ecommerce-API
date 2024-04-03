import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId } from './LP_PRODUCT_CATEGORY';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_CATEGORYAttributes {
  id: string;
  storeId: string;
  parentId?: string;
  categoryName?: string;
  categoryTag?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_CATEGORYPk = "id";
export type LP_CATEGORYId = LP_CATEGORY[LP_CATEGORYPk];
export type LP_CATEGORYOptionalAttributes = "id" | "parentId" | "categoryName" | "categoryTag" | "status" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_CATEGORYCreationAttributes = Optional<LP_CATEGORYAttributes, LP_CATEGORYOptionalAttributes>;

export class LP_CATEGORY extends Model<LP_CATEGORYAttributes, LP_CATEGORYCreationAttributes> implements LP_CATEGORYAttributes {
  id!: string;
  storeId!: string;
  parentId?: string;
  categoryName?: string;
  categoryTag?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_CATEGORY hasMany LP_PRODUCT_CATEGORY via categoryId
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
  // LP_CATEGORY belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_CATEGORY {
    return LP_CATEGORY.init({
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
    parentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'parent_id'
    },
    categoryName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'category_name'
    },
    categoryTag: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'category_tag'
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
    tableName: 'LP_CATEGORY',
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
        name: "fk_store_id_category",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
