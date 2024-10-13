import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';

export interface LP_SUBSCRIPTION_CANCEL_REASONAttributes {
  id: number;
  subscriptionId: string;
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SUBSCRIPTION_CANCEL_REASONPk = 'id';
export type LP_SUBSCRIPTION_CANCEL_REASONId =
  LP_SUBSCRIPTION_CANCEL_REASON[LP_SUBSCRIPTION_CANCEL_REASONPk];
export type LP_SUBSCRIPTION_CANCEL_REASONOptionalAttributes =
  | 'id'
  | 'createdAt'
  | 'updatedAt';
export type LP_SUBSCRIPTION_CANCEL_REASONCreationAttributes = Optional<
  LP_SUBSCRIPTION_CANCEL_REASONAttributes,
  LP_SUBSCRIPTION_CANCEL_REASONOptionalAttributes
>;

export class LP_SUBSCRIPTION_CANCEL_REASON
  extends Model<
    LP_SUBSCRIPTION_CANCEL_REASONAttributes,
    LP_SUBSCRIPTION_CANCEL_REASONCreationAttributes
  >
  implements LP_SUBSCRIPTION_CANCEL_REASONAttributes
{
  id!: number;
  subscriptionId!: string;
  cancelReason!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SUBSCRIPTION_CANCEL_REASON belongsTo LP_SUBSCRIPTION via subscriptionId
  subscription!: LP_SUBSCRIPTION;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<LP_SUBSCRIPTION>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<LP_SUBSCRIPTION>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_SUBSCRIPTION_CANCEL_REASON {
    return LP_SUBSCRIPTION_CANCEL_REASON.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        subscriptionId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_SUBSCRIPTION',
            key: 'id',
          },
          field: 'subscription_id',
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
        tableName: 'LP_SUBSCRIPTION_CANCEL_REASON',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'subscription_id',
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }],
          },
        ],
      },
    );
  }
}
