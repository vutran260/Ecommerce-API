import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';

export interface LP_SUBSCRIPTION_ORDERAttributes {
  subscriptionId: string;
  orderId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SUBSCRIPTION_ORDERPk = "subscriptionId" | "orderId";
export type LP_SUBSCRIPTION_ORDERId = LP_SUBSCRIPTION_ORDER[LP_SUBSCRIPTION_ORDERPk];
export type LP_SUBSCRIPTION_ORDEROptionalAttributes = "createdAt" | "updatedAt";
export type LP_SUBSCRIPTION_ORDERCreationAttributes = Optional<LP_SUBSCRIPTION_ORDERAttributes, LP_SUBSCRIPTION_ORDEROptionalAttributes>;

export class LP_SUBSCRIPTION_ORDER extends Model<LP_SUBSCRIPTION_ORDERAttributes, LP_SUBSCRIPTION_ORDERCreationAttributes> implements LP_SUBSCRIPTION_ORDERAttributes {
  subscriptionId!: string;
  orderId!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SUBSCRIPTION_ORDER belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_SUBSCRIPTION_ORDER belongsTo LP_SUBSCRIPTION via subscriptionId
  subscription!: LP_SUBSCRIPTION;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<LP_SUBSCRIPTION>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<LP_SUBSCRIPTION, LP_SUBSCRIPTIONId>;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<LP_SUBSCRIPTION>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SUBSCRIPTION_ORDER {
    return LP_SUBSCRIPTION_ORDER.init({
    subscriptionId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_SUBSCRIPTION',
        key: 'id'
      },
      field: 'subscription_id'
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'LP_SUBSCRIPTION_ORDER',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subscription_id" },
          { name: "order_id" },
        ]
      },
      {
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
