import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_FAVORITEAttributes {
  buyerId: string;
  productId: string;
  createdAt?: Date;
}

export type LP_FAVORITEPk = 'buyerId' | 'productId';
export type LP_FAVORITEId = LP_FAVORITE[LP_FAVORITEPk];
export type LP_FAVORITEOptionalAttributes = 'createdAt';
export type LP_FAVORITECreationAttributes = Optional<
  LP_FAVORITEAttributes,
  LP_FAVORITEOptionalAttributes
>;

export class LP_FAVORITE
  extends Model<LP_FAVORITEAttributes, LP_FAVORITECreationAttributes>
  implements LP_FAVORITEAttributes
{
  buyerId!: string;
  productId!: string;
  createdAt?: Date;

  // LP_FAVORITE belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_FAVORITE belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_FAVORITE {
    return LP_FAVORITE.init(
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_FAVORITE',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }, { name: 'product_id' }],
          },
          {
            name: 'fk_product_id_favorite',
            using: 'BTREE',
            fields: [{ name: 'product_id' }],
          },
        ],
      },
    );
  }
}
