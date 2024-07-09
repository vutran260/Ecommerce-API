import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId } from './LP_ITEM_SUBSCRIPTION';
import type { LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId } from './LP_PRODUCT_CATEGORY';
import type { LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId } from './LP_PRODUCT_COMPONENT';
import type { LP_PRODUCT_FAQ, LP_PRODUCT_FAQId } from './LP_PRODUCT_FAQ';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCTAttributes {
  id: string;
  storeId: string;
  isSubscription: number;
  buyingPeriod?: string;
  isDiscount: number;
  discountPercentage?: number;
  hasDiscountSchedule?: number;
  discountTimeFrom?: Date;
  discountTimeTo?: Date;
  isRecommend: number;
  productName: string;
  productImage: string;
  productDescription: string;
  productOverview: string;
  price: number;
  priceSubscription?: number;
  cost?: number;
  stockItem?: number;
  productTag?: string;
  status?: string;
  quantity?: number;
  isDeleted: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_PRODUCTPk = "id";
export type LP_PRODUCTId = LP_PRODUCT[LP_PRODUCTPk];
export type LP_PRODUCTOptionalAttributes = "id" | "buyingPeriod" | "discountPercentage" | "hasDiscountSchedule" | "discountTimeFrom" | "discountTimeTo" | "priceSubscription" | "cost" | "stockItem" | "productTag" | "status" | "quantity" | "isDeleted" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_PRODUCTCreationAttributes = Optional<LP_PRODUCTAttributes, LP_PRODUCTOptionalAttributes>;

export class LP_PRODUCT extends Model<LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes> implements LP_PRODUCTAttributes {
  id!: string;
  storeId!: string;
  isSubscription!: number;
  buyingPeriod?: string;
  isDiscount!: number;
  discountPercentage?: number;
  hasDiscountSchedule?: number;
  discountTimeFrom?: Date;
  discountTimeTo?: Date;
  isRecommend!: number;
  productName!: string;
  productImage!: string;
  productDescription!: string;
  productOverview!: string;
  price!: number;
  priceSubscription?: number;
  cost?: number;
  stockItem?: number;
  productTag?: string;
  status?: string;
  quantity?: number;
  isDeleted!: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_PRODUCT hasMany LP_CART via productId
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
  // LP_PRODUCT belongsToMany LP_CATEGORY via productId and categoryId
  categoryIdLpCategories!: LP_CATEGORY[];
  getCategoryIdLpCategories!: Sequelize.BelongsToManyGetAssociationsMixin<LP_CATEGORY>;
  setCategoryIdLpCategories!: Sequelize.BelongsToManySetAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  addCategoryIdLpCategory!: Sequelize.BelongsToManyAddAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  addCategoryIdLpCategories!: Sequelize.BelongsToManyAddAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  createCategoryIdLpCategory!: Sequelize.BelongsToManyCreateAssociationMixin<LP_CATEGORY>;
  removeCategoryIdLpCategory!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  removeCategoryIdLpCategories!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasCategoryIdLpCategory!: Sequelize.BelongsToManyHasAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasCategoryIdLpCategories!: Sequelize.BelongsToManyHasAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  countCategoryIdLpCategories!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_ITEM_SUBSCRIPTION via productId
  lpItemSubscriptions!: LP_ITEM_SUBSCRIPTION[];
  getLpItemSubscriptions!: Sequelize.HasManyGetAssociationsMixin<LP_ITEM_SUBSCRIPTION>;
  setLpItemSubscriptions!: Sequelize.HasManySetAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  addLpItemSubscription!: Sequelize.HasManyAddAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  addLpItemSubscriptions!: Sequelize.HasManyAddAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  createLpItemSubscription!: Sequelize.HasManyCreateAssociationMixin<LP_ITEM_SUBSCRIPTION>;
  removeLpItemSubscription!: Sequelize.HasManyRemoveAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  removeLpItemSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  hasLpItemSubscription!: Sequelize.HasManyHasAssociationMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  hasLpItemSubscriptions!: Sequelize.HasManyHasAssociationsMixin<LP_ITEM_SUBSCRIPTION, LP_ITEM_SUBSCRIPTIONId>;
  countLpItemSubscriptions!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_CATEGORY via productId
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
  // LP_PRODUCT hasMany LP_PRODUCT_COMPONENT via productId
  lpProductComponents!: LP_PRODUCT_COMPONENT[];
  getLpProductComponents!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_COMPONENT>;
  setLpProductComponents!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  addLpProductComponent!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  addLpProductComponents!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  createLpProductComponent!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_COMPONENT>;
  removeLpProductComponent!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  removeLpProductComponents!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  hasLpProductComponent!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  hasLpProductComponents!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  countLpProductComponents!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_FAQ via productId
  lpProductFaqs!: LP_PRODUCT_FAQ[];
  getLpProductFaqs!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_FAQ>;
  setLpProductFaqs!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  addLpProductFaq!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  addLpProductFaqs!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  createLpProductFaq!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_FAQ>;
  removeLpProductFaq!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  removeLpProductFaqs!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  hasLpProductFaq!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  hasLpProductFaqs!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_FAQ, LP_PRODUCT_FAQId>;
  countLpProductFaqs!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT {
    return LP_PRODUCT.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    isSubscription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_subscription'
    },
    buyingPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'buying_period'
    },
    isDiscount: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_discount'
    },
    discountPercentage: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      field: 'discount_percentage'
    },
    hasDiscountSchedule: {
      type: DataTypes.TINYINT,
      allowNull: true,
      field: 'has_discount_schedule'
    },
    discountTimeFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'discount_time_from'
    },
    discountTimeTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'discount_time_to'
    },
    isRecommend: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_recommend'
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'product_name'
    },
    productImage: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_image'
    },
    productDescription: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_description'
    },
    productOverview: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_overview'
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    priceSubscription: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'price_subscription'
    },
    cost: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    stockItem: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'stock_item'
    },
    productTag: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_tag'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: 'is_deleted'
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
