import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ADDRESS_BUYER, LP_ADDRESS_BUYERId } from './LP_ADDRESS_BUYER';
import type {
  LP_ADDRESS_BUYER_SSO,
  LP_ADDRESS_BUYER_SSOId,
} from './LP_ADDRESS_BUYER_SSO';
import type {
  LP_BUYER_PERSONAL_INFORMATION,
  LP_BUYER_PERSONAL_INFORMATIONId,
} from './LP_BUYER_PERSONAL_INFORMATION';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_FAVORITE, LP_FAVORITEId } from './LP_FAVORITE';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type {
  LP_PRODUCT_RECENTLY_VIEWED,
  LP_PRODUCT_RECENTLY_VIEWEDId,
} from './LP_PRODUCT_RECENTLY_VIEWED';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_STORE_BUYER, LP_STORE_BUYERId } from './LP_STORE_BUYER';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';

export interface LP_BUYERAttributes {
  id: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_BUYERPk = 'id';
export type LP_BUYERId = LP_BUYER[LP_BUYERPk];
export type LP_BUYEROptionalAttributes =
  | 'id'
  | 'username'
  | 'fullname'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';
export type LP_BUYERCreationAttributes = Optional<
  LP_BUYERAttributes,
  LP_BUYEROptionalAttributes
>;

export class LP_BUYER
  extends Model<LP_BUYERAttributes, LP_BUYERCreationAttributes>
  implements LP_BUYERAttributes
{
  id!: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_BUYER hasMany LP_ADDRESS_BUYER via buyerId
  lpAddressBuyers!: LP_ADDRESS_BUYER[];
  getLpAddressBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_ADDRESS_BUYER>;
  setLpAddressBuyers!: Sequelize.HasManySetAssociationsMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  addLpAddressBuyer!: Sequelize.HasManyAddAssociationMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  addLpAddressBuyers!: Sequelize.HasManyAddAssociationsMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  createLpAddressBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_ADDRESS_BUYER>;
  removeLpAddressBuyer!: Sequelize.HasManyRemoveAssociationMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  removeLpAddressBuyers!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  hasLpAddressBuyer!: Sequelize.HasManyHasAssociationMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  hasLpAddressBuyers!: Sequelize.HasManyHasAssociationsMixin<
    LP_ADDRESS_BUYER,
    LP_ADDRESS_BUYERId
  >;
  countLpAddressBuyers!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER hasOne LP_ADDRESS_BUYER_SSO via buyerId
  lpAddressBuyerSso!: LP_ADDRESS_BUYER_SSO;
  getLpAddressBuyerSso!: Sequelize.HasOneGetAssociationMixin<LP_ADDRESS_BUYER_SSO>;
  setLpAddressBuyerSso!: Sequelize.HasOneSetAssociationMixin<
    LP_ADDRESS_BUYER_SSO,
    LP_ADDRESS_BUYER_SSOId
  >;
  createLpAddressBuyerSso!: Sequelize.HasOneCreateAssociationMixin<LP_ADDRESS_BUYER_SSO>;
  // LP_BUYER hasOne LP_BUYER_PERSONAL_INFORMATION via buyerId
  lpBuyerPersonalInformation!: LP_BUYER_PERSONAL_INFORMATION;
  getLpBuyerPersonalInformation!: Sequelize.HasOneGetAssociationMixin<LP_BUYER_PERSONAL_INFORMATION>;
  setLpBuyerPersonalInformation!: Sequelize.HasOneSetAssociationMixin<
    LP_BUYER_PERSONAL_INFORMATION,
    LP_BUYER_PERSONAL_INFORMATIONId
  >;
  createLpBuyerPersonalInformation!: Sequelize.HasOneCreateAssociationMixin<LP_BUYER_PERSONAL_INFORMATION>;
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
  // LP_BUYER hasMany LP_FAVORITE via buyerId
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
  // LP_BUYER hasMany LP_ORDER via buyerId
  lpOrders!: LP_ORDER[];
  getLpOrders!: Sequelize.HasManyGetAssociationsMixin<LP_ORDER>;
  setLpOrders!: Sequelize.HasManySetAssociationsMixin<LP_ORDER, LP_ORDERId>;
  addLpOrder!: Sequelize.HasManyAddAssociationMixin<LP_ORDER, LP_ORDERId>;
  addLpOrders!: Sequelize.HasManyAddAssociationsMixin<LP_ORDER, LP_ORDERId>;
  createLpOrder!: Sequelize.HasManyCreateAssociationMixin<LP_ORDER>;
  removeLpOrder!: Sequelize.HasManyRemoveAssociationMixin<LP_ORDER, LP_ORDERId>;
  removeLpOrders!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_ORDER,
    LP_ORDERId
  >;
  hasLpOrder!: Sequelize.HasManyHasAssociationMixin<LP_ORDER, LP_ORDERId>;
  hasLpOrders!: Sequelize.HasManyHasAssociationsMixin<LP_ORDER, LP_ORDERId>;
  countLpOrders!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER belongsToMany LP_PRODUCT via buyerId and productId
  productIdLpProducts!: LP_PRODUCT[];
  getProductIdLpProducts!: Sequelize.BelongsToManyGetAssociationsMixin<LP_PRODUCT>;
  setProductIdLpProducts!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProduct!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProducts!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  createProductIdLpProduct!: Sequelize.BelongsToManyCreateAssociationMixin<LP_PRODUCT>;
  removeProductIdLpProduct!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  removeProductIdLpProducts!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProduct!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProducts!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  countProductIdLpProducts!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_BUYER belongsToMany LP_PRODUCT via buyerId and productId
  productIdLpProductLpProductRecentlyVieweds!: LP_PRODUCT[];
  getProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManyGetAssociationsMixin<LP_PRODUCT>;
  setProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpProductRecentlyViewed!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  addProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  createProductIdLpProductLpProductRecentlyViewed!: Sequelize.BelongsToManyCreateAssociationMixin<LP_PRODUCT>;
  removeProductIdLpProductLpProductRecentlyViewed!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  removeProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpProductRecentlyViewed!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  hasProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_PRODUCT,
    LP_PRODUCTId
  >;
  countProductIdLpProductLpProductRecentlyVieweds!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_PRODUCT_RECENTLY_VIEWED via buyerId
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
  // LP_BUYER belongsToMany LP_STORE via buyerId and storeId
  storeIdLpStores!: LP_STORE[];
  getStoreIdLpStores!: Sequelize.BelongsToManyGetAssociationsMixin<LP_STORE>;
  setStoreIdLpStores!: Sequelize.BelongsToManySetAssociationsMixin<
    LP_STORE,
    LP_STOREId
  >;
  addStoreIdLpStore!: Sequelize.BelongsToManyAddAssociationMixin<
    LP_STORE,
    LP_STOREId
  >;
  addStoreIdLpStores!: Sequelize.BelongsToManyAddAssociationsMixin<
    LP_STORE,
    LP_STOREId
  >;
  createStoreIdLpStore!: Sequelize.BelongsToManyCreateAssociationMixin<LP_STORE>;
  removeStoreIdLpStore!: Sequelize.BelongsToManyRemoveAssociationMixin<
    LP_STORE,
    LP_STOREId
  >;
  removeStoreIdLpStores!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    LP_STORE,
    LP_STOREId
  >;
  hasStoreIdLpStore!: Sequelize.BelongsToManyHasAssociationMixin<
    LP_STORE,
    LP_STOREId
  >;
  hasStoreIdLpStores!: Sequelize.BelongsToManyHasAssociationsMixin<
    LP_STORE,
    LP_STOREId
  >;
  countStoreIdLpStores!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_STORE_BUYER via buyerId
  lpStoreBuyers!: LP_STORE_BUYER[];
  getLpStoreBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_BUYER>;
  setLpStoreBuyers!: Sequelize.HasManySetAssociationsMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  addLpStoreBuyer!: Sequelize.HasManyAddAssociationMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  addLpStoreBuyers!: Sequelize.HasManyAddAssociationsMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  createLpStoreBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_BUYER>;
  removeLpStoreBuyer!: Sequelize.HasManyRemoveAssociationMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  removeLpStoreBuyers!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  hasLpStoreBuyer!: Sequelize.HasManyHasAssociationMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  hasLpStoreBuyers!: Sequelize.HasManyHasAssociationsMixin<
    LP_STORE_BUYER,
    LP_STORE_BUYERId
  >;
  countLpStoreBuyers!: Sequelize.HasManyCountAssociationsMixin;
  // LP_BUYER hasMany LP_SUBSCRIPTION via buyerId
  lpSubscriptions!: LP_SUBSCRIPTION[];
  getLpSubscriptions!: Sequelize.HasManyGetAssociationsMixin<LP_SUBSCRIPTION>;
  setLpSubscriptions!: Sequelize.HasManySetAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addLpSubscription!: Sequelize.HasManyAddAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  addLpSubscriptions!: Sequelize.HasManyAddAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createLpSubscription!: Sequelize.HasManyCreateAssociationMixin<LP_SUBSCRIPTION>;
  removeLpSubscription!: Sequelize.HasManyRemoveAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  removeLpSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasLpSubscription!: Sequelize.HasManyHasAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  hasLpSubscriptions!: Sequelize.HasManyHasAssociationsMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  countLpSubscriptions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_BUYER {
    return LP_BUYER.init(
      {
        id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(225),
          allowNull: true,
        },
        fullname: {
          type: DataTypes.STRING(225),
          allowNull: true,
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
        tableName: 'LP_BUYER',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
