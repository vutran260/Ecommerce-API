import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_ORDER_CANCEL_REASONAttributes {
  id: number;
  orderId: number;
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_ORDER_CANCEL_REASONPk = 'id';
export type LP_ORDER_CANCEL_REASONId =
  LP_ORDER_CANCEL_REASON[LP_ORDER_CANCEL_REASONPk];
export type LP_ORDER_CANCEL_REASONOptionalAttributes =
  | 'id'
  | 'createdAt'
  | 'updatedAt';
export type LP_ORDER_CANCEL_REASONCreationAttributes = Optional<
  LP_ORDER_CANCEL_REASONAttributes,
  LP_ORDER_CANCEL_REASONOptionalAttributes
>;

export class LP_ORDER_CANCEL_REASON
  extends Model<
    LP_ORDER_CANCEL_REASONAttributes,
    LP_ORDER_CANCEL_REASONCreationAttributes
  >
  implements LP_ORDER_CANCEL_REASONAttributes
{
  id!: number;
  orderId!: number;
  cancelReason!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_ORDER_CANCEL_REASON belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_ORDER_CANCEL_REASON {
    return LP_ORDER_CANCEL_REASON.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'LP_ORDER',
            key: 'id',
          },
          field: 'order_id',
        },
        cancelReason: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'cancel_reason',
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
        tableName: 'LP_ORDER_CANCEL_REASON',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'order_id',
            using: 'BTREE',
            fields: [{ name: 'order_id' }],
          },
        ],
      },
    );
  }
}
