import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';

export interface LP_SUBSCRIPTION_PRODUCTAttributes {
  subscriptionId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SUBSCRIPTION_PRODUCTPk = 'subscriptionId' | 'productId';
export type LP_SUBSCRIPTION_PRODUCTId =
  LP_SUBSCRIPTION_PRODUCT[LP_SUBSCRIPTION_PRODUCTPk];
export type LP_SUBSCRIPTION_PRODUCTOptionalAttributes =
  | 'createdAt'
  | 'updatedAt';
export type LP_SUBSCRIPTION_PRODUCTCreationAttributes = Optional<
  LP_SUBSCRIPTION_PRODUCTAttributes,
  LP_SUBSCRIPTION_PRODUCTOptionalAttributes
>;

export class LP_SUBSCRIPTION_PRODUCT
  extends Model<
    LP_SUBSCRIPTION_PRODUCTAttributes,
    LP_SUBSCRIPTION_PRODUCTCreationAttributes
  >
  implements LP_SUBSCRIPTION_PRODUCTAttributes
{
  subscriptionId!: string;
  productId!: string;
  quantity!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SUBSCRIPTION_PRODUCT belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;
  // LP_SUBSCRIPTION_PRODUCT belongsTo LP_SUBSCRIPTION via subscriptionId
  subscription!: LP_SUBSCRIPTION;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<LP_SUBSCRIPTION>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<LP_SUBSCRIPTION>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_SUBSCRIPTION_PRODUCT {
    return LP_SUBSCRIPTION_PRODUCT.init(
      {
        subscriptionId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_SUBSCRIPTION',
            key: 'id',
          },
          field: 'subscription_id',
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
        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_SUBSCRIPTION_PRODUCT',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }, { name: 'product_id' }],
          },
          {
            name: 'product_id',
            using: 'BTREE',
            fields: [{ name: 'product_id' }],
          },
        ],
      },
    );
  }
}
