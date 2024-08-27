import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_STORE_BUYERAttributes {
  storeId: string;
  buyerId: string;
  createdAt?: Date;
}

export type LP_STORE_BUYERPk = 'storeId' | 'buyerId';
export type LP_STORE_BUYERId = LP_STORE_BUYER[LP_STORE_BUYERPk];
export type LP_STORE_BUYEROptionalAttributes = 'createdAt';
export type LP_STORE_BUYERCreationAttributes = Optional<
  LP_STORE_BUYERAttributes,
  LP_STORE_BUYEROptionalAttributes
>;

export class LP_STORE_BUYER
  extends Model<LP_STORE_BUYERAttributes, LP_STORE_BUYERCreationAttributes>
  implements LP_STORE_BUYERAttributes
{
  storeId!: string;
  buyerId!: string;
  createdAt?: Date;

  // LP_STORE_BUYER belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_STORE_BUYER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_BUYER {
    return LP_STORE_BUYER.init(
      {
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_STORE_BUYER',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'store_id' }, { name: 'buyer_id' }],
          },
          {
            name: 'buyer_id',
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }],
          },
        ],
      },
    );
  }
}
