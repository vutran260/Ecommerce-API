import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_SHIPMENT_HISTORYAttributes {
  id: string;
  shipmentHistoryDate?: Date;
  shipmentStatus?: string;
  shipmentDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  orderId: string;
}

export type LP_SHIPMENT_HISTORYPk = "id";
export type LP_SHIPMENT_HISTORYId = LP_SHIPMENT_HISTORY[LP_SHIPMENT_HISTORYPk];
export type LP_SHIPMENT_HISTORYOptionalAttributes = "id" | "shipmentHistoryDate" | "shipmentStatus" | "shipmentDescription" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_SHIPMENT_HISTORYCreationAttributes = Optional<LP_SHIPMENT_HISTORYAttributes, LP_SHIPMENT_HISTORYOptionalAttributes>;

export class LP_SHIPMENT_HISTORY extends Model<LP_SHIPMENT_HISTORYAttributes, LP_SHIPMENT_HISTORYCreationAttributes> implements LP_SHIPMENT_HISTORYAttributes {
  id!: string;
  shipmentHistoryDate?: Date;
  shipmentStatus?: string;
  shipmentDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  orderId!: string;

  // LP_SHIPMENT_HISTORY belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SHIPMENT_HISTORY {
    return LP_SHIPMENT_HISTORY.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    shipmentHistoryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'shipment_history_date'
    },
    shipmentStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'shipment_status'
    },
    shipmentDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'shipment_description'
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
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    }
  }, {
    sequelize,
    tableName: 'LP_SHIPMENT_HISTORY',
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
        name: "LP_SHIPMENT_HISTORY_order_id_fkey",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
