import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type {
  LP_PRODUCT_CATEGORY,
  LP_PRODUCT_CATEGORYId,
} from './LP_PRODUCT_CATEGORY';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_CATEGORYAttributes {
  id: string;
  storeId: string;
  parentId?: string;
  categoryName?: string;
  categoryTag?: string;
  categoryImage?: string;
  status?: string;
  orderLevel: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_CATEGORYPk = 'id';
export type LP_CATEGORYId = LP_CATEGORY[LP_CATEGORYPk];
export type LP_CATEGORYOptionalAttributes =
  | 'id'
  | 'parentId'
  | 'categoryName'
  | 'categoryTag'
  | 'categoryImage'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';
export type LP_CATEGORYCreationAttributes = Optional<
  LP_CATEGORYAttributes,
  LP_CATEGORYOptionalAttributes
>;

export class LP_CATEGORY
  extends Model<LP_CATEGORYAttributes, LP_CATEGORYCreationAttributes>
  implements LP_CATEGORYAttributes
{
  id!: string;
  storeId!: string;
  parentId?: string;
  categoryName?: string;
  categoryTag?: string;
  categoryImage?: string;
  status?: string;
  orderLevel!: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_CATEGORY belongsToMany LP_PRODUCT via categoryId and productId
  productIdLpProductLpProductCategories!: LP_PRODUCT[];
  getProductIdLpProductLpProductCategories!: Sequelize.BelongsToManyGetAssociationsMixin<LP_PRODUCT>;
  setProductIdLpProductLpProductCategories!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpProductCategory!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpProductCategories!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  createProductIdLpProductLpProductCategory!: Sequelize.BelongsToManyCreateAssociationMixin<LP_PRODUCT>;
  removeProductIdLpProductLpProductCategory!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  removeProductIdLpProductLpProductCategories!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpProductCategory!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpProductCategories!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  countProductIdLpProductLpProductCategories!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_CATEGORY hasMany LP_PRODUCT_CATEGORY via categoryId
  lpProductCategories!: LP_PRODUCT_CATEGORY[];
  getLpProductCategories!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_CATEGORY>;
  setLpProductCategories!: Sequelize.HasManySetAssociationsMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  addLpProductCategory!: Sequelize.HasManyAddAssociationMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  addLpProductCategories!: Sequelize.HasManyAddAssociationsMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  createLpProductCategory!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_CATEGORY>;
  removeLpProductCategory!: Sequelize.HasManyRemoveAssociationMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  removeLpProductCategories!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  hasLpProductCategory!: Sequelize.HasManyHasAssociationMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  hasLpProductCategories!: Sequelize.HasManyHasAssociationsMixin<
    LP_PRODUCT_CATEGORY,
    LP_PRODUCT_CATEGORYId
  >;
  countLpProductCategories!: Sequelize.HasManyCountAssociationsMixin;
  // LP_CATEGORY belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_CATEGORY {
    return LP_CATEGORY.init(
      {
        id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
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
        parentId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          field: 'parent_id',
        },
        categoryName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'category_name',
        },
        categoryTag: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'category_tag',
        },
        categoryImage: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'category_image',
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        orderLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'order_level',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_CATEGORY',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'fk_store_id_category',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
