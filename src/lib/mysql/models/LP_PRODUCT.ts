import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_FAVORITE, LP_FAVORITEId } from './LP_FAVORITE';
import type { LP_ORDER_ITEM, LP_ORDER_ITEMId } from './LP_ORDER_ITEM';
import type {
  LP_PRODUCT_CATEGORY,
  LP_PRODUCT_CATEGORYId,
} from './LP_PRODUCT_CATEGORY';
import type {
  LP_PRODUCT_COMPONENT,
  LP_PRODUCT_COMPONENTId,
} from './LP_PRODUCT_COMPONENT';
import type { LP_PRODUCT_FAQ, LP_PRODUCT_FAQId } from './LP_PRODUCT_FAQ';
import type {
  LP_PRODUCT_RECENTLY_VIEWED,
  LP_PRODUCT_RECENTLY_VIEWEDId,
} from './LP_PRODUCT_RECENTLY_VIEWED';
import type {
  LP_PRODUCT_SPECIAL_FAQ,
  LP_PRODUCT_SPECIAL_FAQId,
} from './LP_PRODUCT_SPECIAL_FAQ';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';
import type {
  LP_SUBSCRIPTION_PRODUCT,
  LP_SUBSCRIPTION_PRODUCTId,
} from './LP_SUBSCRIPTION_PRODUCT';

export interface LP_PRODUCTAttributes {
  id: string;
  storeId: string;
  isSubscription: number;
  isSpecial: number;
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
  isDeleted: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_PRODUCTPk = 'id';
export type LP_PRODUCTId = LP_PRODUCT[LP_PRODUCTPk];
export type LP_PRODUCTOptionalAttributes =
  | 'id'
  | 'isSpecial'
  | 'buyingPeriod'
  | 'discountPercentage'
  | 'hasDiscountSchedule'
  | 'discountTimeFrom'
  | 'discountTimeTo'
  | 'priceSubscription'
  | 'cost'
  | 'stockItem'
  | 'productTag'
  | 'status'
  | 'isDeleted'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';
export type LP_PRODUCTCreationAttributes = Optional<
  LP_PRODUCTAttributes,
  LP_PRODUCTOptionalAttributes
>;

export class LP_PRODUCT
  extends Model<LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes>
  implements LP_PRODUCTAttributes
{
  id!: string;
  storeId!: string;
  isSubscription!: number;
  isSpecial!: number;
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
  isDeleted!: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_PRODUCT belongsToMany LP_BUYER via productId and buyerId
  buyerIdLpBuyers!: LP_BUYER[];
  getBuyerIdLpBuyers!: Sequelize.BelongsToManyGetAssociationsMixin<LP_BUYER>;
  setBuyerIdLpBuyers!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  addBuyerIdLpBuyer!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  addBuyerIdLpBuyers!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  createBuyerIdLpBuyer!: Sequelize.BelongsToManyCreateAssociationMixin<LP_BUYER>;
  removeBuyerIdLpBuyer!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  removeBuyerIdLpBuyers!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  hasBuyerIdLpBuyer!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  hasBuyerIdLpBuyers!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  countBuyerIdLpBuyers!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_PRODUCT belongsToMany LP_BUYER via productId and buyerId
  buyerIdLpBuyerLpProductRecentlyVieweds!: LP_BUYER[];
  getBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManyGetAssociationsMixin<LP_BUYER>;
  setBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  addBuyerIdLpBuyerLpProductRecentlyViewed!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  addBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  createBuyerIdLpBuyerLpProductRecentlyViewed!: Sequelize.BelongsToManyCreateAssociationMixin<LP_BUYER>;
  removeBuyerIdLpBuyerLpProductRecentlyViewed!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  removeBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  hasBuyerIdLpBuyerLpProductRecentlyViewed!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  hasBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_BUYER,
    LP_BUYERId
  >;
  countBuyerIdLpBuyerLpProductRecentlyVieweds!: Sequelize.BelongsToManyCountAssociationsMixin;
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
  setCategoryIdLpCategories!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  addCategoryIdLpCategory!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  addCategoryIdLpCategories!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  createCategoryIdLpCategory!: Sequelize.BelongsToManyCreateAssociationMixin<LP_CATEGORY>;
  removeCategoryIdLpCategory!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  removeCategoryIdLpCategories!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  hasCategoryIdLpCategory!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  hasCategoryIdLpCategories!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_CATEGORY,
    LP_CATEGORYId
  >;
  countCategoryIdLpCategories!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_FAVORITE via productId
  lpFavorites!: LP_FAVORITE[];
  getLpFavorites!: Sequelize.HasManyGetAssociationsMixin<LP_FAVORITE>;
  setLpFavorites!: Sequelize.HasManySetAssociationsMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  addLpFavorite!: Sequelize.HasManyAddAssociationMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  addLpFavorites!: Sequelize.HasManyAddAssociationsMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  createLpFavorite!: Sequelize.HasManyCreateAssociationMixin<LP_FAVORITE>;
  removeLpFavorite!: Sequelize.HasManyRemoveAssociationMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  removeLpFavorites!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  hasLpFavorite!: Sequelize.HasManyHasAssociationMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  hasLpFavorites!: Sequelize.HasManyHasAssociationsMixin<
    LP_FAVORITE,
    LP_FAVORITEId
  >;
  countLpFavorites!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_ORDER_ITEM via productId
  lpOrderItems!: LP_ORDER_ITEM[];
  getLpOrderItems!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER_ITEM>;
  setLpOrderItems!: Sequelize.HasManySetAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  addLpOrderItem!: Sequelize.HasManyAddAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  addLpOrderItems!: Sequelize.HasManyAddAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  createLpOrderItem!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER_ITEM>;
  removeLpOrderItem!: Sequelize.HasManyRemoveAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  removeLpOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  hasLpOrderItem!: Sequelize.HasManyHasAssociationMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  hasLpOrderItems!: Sequelize.HasManyHasAssociationsMixin<
    LP_ORDER_ITEM,
    LP_ORDER_ITEMId
  >;
  countLpOrderItems!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_CATEGORY via productId
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
  // LP_PRODUCT hasMany LP_PRODUCT_COMPONENT via productId
  lpProductComponents!: LP_PRODUCT_COMPONENT[];
  getLpProductComponents!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_COMPONENT>;
  setLpProductComponents!: Sequelize.HasManySetAssociationsMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  addLpProductComponent!: Sequelize.HasManyAddAssociationMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  addLpProductComponents!: Sequelize.HasManyAddAssociationsMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  createLpProductComponent!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_COMPONENT>;
  removeLpProductComponent!: Sequelize.HasManyRemoveAssociationMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  removeLpProductComponents!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  hasLpProductComponent!: Sequelize.HasManyHasAssociationMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  hasLpProductComponents!: Sequelize.HasManyHasAssociationsMixin<
    LP_PRODUCT_COMPONENT,
    LP_PRODUCT_COMPONENTId
  >;
  countLpProductComponents!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_FAQ via productId
  lpProductFaqs!: LP_PRODUCT_FAQ[];
  getLpProductFaqs!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_FAQ>;
  setLpProductFaqs!: Sequelize.HasManySetAssociationsMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  addLpProductFaq!: Sequelize.HasManyAddAssociationMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  addLpProductFaqs!: Sequelize.HasManyAddAssociationsMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  createLpProductFaq!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_FAQ>;
  removeLpProductFaq!: Sequelize.HasManyRemoveAssociationMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  removeLpProductFaqs!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  hasLpProductFaq!: Sequelize.HasManyHasAssociationMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  hasLpProductFaqs!: Sequelize.HasManyHasAssociationsMixin<
    LP_PRODUCT_FAQ,
    LP_PRODUCT_FAQId
  >;
  countLpProductFaqs!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_RECENTLY_VIEWED via productId
  lpProductRecentlyVieweds!: LP_PRODUCT_RECENTLY_VIEWED[];
  getLpProductRecentlyVieweds!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_RECENTLY_VIEWED>;
  setLpProductRecentlyVieweds!: Sequelize.HasManySetAssociationsMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  addLpProductRecentlyViewed!: Sequelize.HasManyAddAssociationMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  addLpProductRecentlyVieweds!: Sequelize.HasManyAddAssociationsMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  createLpProductRecentlyViewed!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_RECENTLY_VIEWED>;
  removeLpProductRecentlyViewed!: Sequelize.HasManyRemoveAssociationMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  removeLpProductRecentlyVieweds!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  hasLpProductRecentlyViewed!: Sequelize.HasManyHasAssociationMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  hasLpProductRecentlyVieweds!: Sequelize.HasManyHasAssociationsMixin<
    LP_PRODUCT_RECENTLY_VIEWED,
    LP_PRODUCT_RECENTLY_VIEWEDId
  >;
  countLpProductRecentlyVieweds!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_SPECIAL_FAQ via productId
  lpProductSpecialFaqs!: LP_PRODUCT_SPECIAL_FAQ[];
  getLpProductSpecialFaqs!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_SPECIAL_FAQ>;
  setLpProductSpecialFaqs!: Sequelize.HasManySetAssociationsMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  addLpProductSpecialFaq!: Sequelize.HasManyAddAssociationMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  addLpProductSpecialFaqs!: Sequelize.HasManyAddAssociationsMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  createLpProductSpecialFaq!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_SPECIAL_FAQ>;
  removeLpProductSpecialFaq!: Sequelize.HasManyRemoveAssociationMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  removeLpProductSpecialFaqs!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  hasLpProductSpecialFaq!: Sequelize.HasManyHasAssociationMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  hasLpProductSpecialFaqs!: Sequelize.HasManyHasAssociationsMixin<
    LP_PRODUCT_SPECIAL_FAQ,
    LP_PRODUCT_SPECIAL_FAQId
  >;
  countLpProductSpecialFaqs!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT belongsToMany LP_SUBSCRIPTION via productId and subscriptionId
  subscriptionIdLpSubscriptionLpSubscriptionProducts!: LP_SUBSCRIPTION[];
  getSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManyGetAssociationsMixin<LP_SUBSCRIPTION>;
  setSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addSubscriptionIdLpSubscriptionLpSubscriptionProduct!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createSubscriptionIdLpSubscriptionLpSubscriptionProduct!: Sequelize.BelongsToManyCreateAssociationMixin<LP_SUBSCRIPTION>;
  removeSubscriptionIdLpSubscriptionLpSubscriptionProduct!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  removeSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasSubscriptionIdLpSubscriptionLpSubscriptionProduct!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  countSubscriptionIdLpSubscriptionLpSubscriptionProducts!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_SUBSCRIPTION_PRODUCT via productId
  lpSubscriptionProducts!: LP_SUBSCRIPTION_PRODUCT[];
  getLpSubscriptionProducts!: Sequelize.HasManyGetAssociationsMixin<LP_SUBSCRIPTION_PRODUCT>;
  setLpSubscriptionProducts!: Sequelize.HasManySetAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  addLpSubscriptionProduct!: Sequelize.HasManyAddAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  addLpSubscriptionProducts!: Sequelize.HasManyAddAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  createLpSubscriptionProduct!: Sequelize.HasManyCreateAssociationMixin<LP_SUBSCRIPTION_PRODUCT>;
  removeLpSubscriptionProduct!: Sequelize.HasManyRemoveAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  removeLpSubscriptionProducts!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  hasLpSubscriptionProduct!: Sequelize.HasManyHasAssociationMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  hasLpSubscriptionProducts!: Sequelize.HasManyHasAssociationsMixin<
    LP_SUBSCRIPTION_PRODUCT,
    LP_SUBSCRIPTION_PRODUCTId
  >;
  countLpSubscriptionProducts!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT {
    return LP_PRODUCT.init(
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
        isSubscription: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_subscription',
        },
        isSpecial: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
          comment: 'Is special product',
          field: 'is_special',
        },
        buyingPeriod: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'buying_period',
        },
        isDiscount: {
          type: DataTypes.TINYINT,
          allowNull: false,
          field: 'is_discount',
        },
        discountPercentage: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: true,
          field: 'discount_percentage',
        },
        hasDiscountSchedule: {
          type: DataTypes.TINYINT,
          allowNull: true,
          field: 'has_discount_schedule',
        },
        discountTimeFrom: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'discount_time_from',
        },
        discountTimeTo: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'discount_time_to',
        },
        isRecommend: {
          type: DataTypes.TINYINT,
          allowNull: false,
          field: 'is_recommend',
        },
        productName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'product_name',
        },
        productImage: {
          type: DataTypes.STRING(2000),
          allowNull: false,
          field: 'product_image',
        },
        productDescription: {
          type: DataTypes.STRING(2000),
          allowNull: false,
          field: 'product_description',
        },
        productOverview: {
          type: DataTypes.STRING(2000),
          allowNull: false,
          field: 'product_overview',
        },
        price: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        priceSubscription: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          field: 'price_subscription',
        },
        cost: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: true,
        },
        stockItem: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          field: 'stock_item',
        },
        productTag: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'product_tag',
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isDeleted: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
          field: 'is_deleted',
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
        tableName: 'LP_PRODUCT',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'fk_store_id_product',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
