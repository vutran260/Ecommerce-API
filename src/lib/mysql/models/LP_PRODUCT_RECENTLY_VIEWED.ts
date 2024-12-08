import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCT_RECENTLY_VIEWEDAttributes {
  buyerId: string;
  productId: string;
  viewedAt: Date;
  storeId: string;
}

export type LP_PRODUCT_RECENTLY_VIEWEDPk = 'buyerId' | 'productId';
export type LP_PRODUCT_RECENTLY_VIEWEDId =
  LP_PRODUCT_RECENTLY_VIEWED[LP_PRODUCT_RECENTLY_VIEWEDPk];
export type LP_PRODUCT_RECENTLY_VIEWEDOptionalAttributes = 'viewedAt';
export type LP_PRODUCT_RECENTLY_VIEWEDCreationAttributes = Optional<
  LP_PRODUCT_RECENTLY_VIEWEDAttributes,
  LP_PRODUCT_RECENTLY_VIEWEDOptionalAttributes
>;

export class LP_PRODUCT_RECENTLY_VIEWED
  extends Model<
    LP_PRODUCT_RECENTLY_VIEWEDAttributes,
    LP_PRODUCT_RECENTLY_VIEWEDCreationAttributes
  >
  implements LP_PRODUCT_RECENTLY_VIEWEDAttributes
{
  buyerId!: string;
  productId!: string;
  viewedAt!: Date;
  storeId!: string;

  // LP_PRODUCT_RECENTLY_VIEWED belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_PRODUCT_RECENTLY_VIEWED belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;
  // LP_PRODUCT_RECENTLY_VIEWED belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_PRODUCT_RECENTLY_VIEWED {
    return LP_PRODUCT_RECENTLY_VIEWED.init(
      {
        buyerId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_BUYER',
            key: 'id',
          },
          field: 'buyer_id',
        },
        productId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_PRODUCT',
            key: 'id',
          },
          field: 'product_id',
        },
        viewedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'viewed_at',
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
      },
      {
        sequelize,
        tableName: 'LP_PRODUCT_RECENTLY_VIEWED',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }, { name: 'product_id' }],
          },
          {
            name: 'product_id',
            using: 'BTREE',
            fields: [{ name: 'product_id' }],
          },
          {
            name: 'LP_PRODUCT_RECENTLY_VIEWED_store_id_foreign_idx',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
