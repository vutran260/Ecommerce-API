import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_SHIPMENT_HISTORY, LP_SHIPMENT_HISTORYCreationAttributes, LP_SHIPMENT_HISTORYId } from './LP_SHIPMENT_HISTORY';

export interface LP_SHIPMENTAttributes {
  id: string;
  orderId: string;
  shipmentFee?: number;
  shipmentFeeDiscount?: number;
  arrivedAt?: Date;
  planArrivedFrom?: Date;
  planArrivedTo?: Date;
  shipmentBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_SHIPMENTPk = "id";
export type LP_SHIPMENTId = LP_SHIPMENT[LP_SHIPMENTPk];
export type LP_SHIPMENTOptionalAttributes = "id" | "shipmentFee" | "shipmentFeeDiscount" | "arrivedAt" | "planArrivedFrom" | "planArrivedTo" | "shipmentBy" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_SHIPMENTCreationAttributes = Optional<LP_SHIPMENTAttributes, LP_SHIPMENTOptionalAttributes>;

export class LP_SHIPMENT extends Model<LP_SHIPMENTAttributes, LP_SHIPMENTCreationAttributes> implements LP_SHIPMENTAttributes {
  id!: string;
  orderId!: string;
  shipmentFee?: number;
  shipmentFeeDiscount?: number;
  arrivedAt?: Date;
  planArrivedFrom?: Date;
  planArrivedTo?: Date;
  shipmentBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_SHIPMENT belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_SHIPMENT hasOne LP_SHIPMENT_HISTORY via shipmentId
  lpShipmentHistory!: LP_SHIPMENT_HISTORY;
  getLpShipmentHistory!: Sequelize.HasOneGetAssociationMixin<LP_SHIPMENT_HISTORY>;
  setLpShipmentHistory!: Sequelize.HasOneSetAssociationMixin<LP_SHIPMENT_HISTORY, LP_SHIPMENT_HISTORYId>;
  createLpShipmentHistory!: Sequelize.HasOneCreateAssociationMixin<LP_SHIPMENT_HISTORY>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SHIPMENT {
    return LP_SHIPMENT.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      unique: "LP_SHIPMENT_ibfk_1",
      field: 'order_id'
    },
    shipmentFee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'shipment_fee'
    },
    shipmentFeeDiscount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'shipment_fee_discount'
    },
    arrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'arrived_at'
    },
    planArrivedFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'plan_arrived_from'
    },
    planArrivedTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'plan_arrived_to'
    },
    shipmentBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'shipment_by'
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
    tableName: 'LP_SHIPMENT',
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
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
