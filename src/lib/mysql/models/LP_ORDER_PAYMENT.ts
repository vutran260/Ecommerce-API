import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_ORDER_PAYMENTAttributes {
  id: string;
  orderId?: string;
  paymentType?: string;
  paymentStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_ORDER_PAYMENTPk = "id";
export type LP_ORDER_PAYMENTId = LP_ORDER_PAYMENT[LP_ORDER_PAYMENTPk];
export type LP_ORDER_PAYMENTOptionalAttributes = "id" | "orderId" | "paymentType" | "paymentStatus" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_ORDER_PAYMENTCreationAttributes = Optional<LP_ORDER_PAYMENTAttributes, LP_ORDER_PAYMENTOptionalAttributes>;

export class LP_ORDER_PAYMENT extends Model<LP_ORDER_PAYMENTAttributes, LP_ORDER_PAYMENTCreationAttributes> implements LP_ORDER_PAYMENTAttributes {
  id!: string;
  orderId?: string;
  paymentType?: string;
  paymentStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_ORDER_PAYMENT belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER_PAYMENT {
    return LP_ORDER_PAYMENT.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    },
    paymentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'payment_type'
    },
    paymentStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'payment_status'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_ORDER_PAYMENT',
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
