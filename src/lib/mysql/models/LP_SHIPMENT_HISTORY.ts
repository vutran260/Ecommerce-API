import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_SHIPMENT, LP_SHIPMENTId } from './LP_SHIPMENT';

export interface LP_SHIPMENT_HISTORYAttributes {
  id: string;
  shipmentId?: string;
  shipmentHistoryDate?: Date;
  shipmentStatus?: string;
  shipmentDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_SHIPMENT_HISTORYPk = "id";
export type LP_SHIPMENT_HISTORYId = LP_SHIPMENT_HISTORY[LP_SHIPMENT_HISTORYPk];
export type LP_SHIPMENT_HISTORYOptionalAttributes = "id" | "shipmentId" | "shipmentHistoryDate" | "shipmentStatus" | "shipmentDescription" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_SHIPMENT_HISTORYCreationAttributes = Optional<LP_SHIPMENT_HISTORYAttributes, LP_SHIPMENT_HISTORYOptionalAttributes>;

export class LP_SHIPMENT_HISTORY extends Model<LP_SHIPMENT_HISTORYAttributes, LP_SHIPMENT_HISTORYCreationAttributes> implements LP_SHIPMENT_HISTORYAttributes {
  id!: string;
  shipmentId?: string;
  shipmentHistoryDate?: Date;
  shipmentStatus?: string;
  shipmentDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_SHIPMENT_HISTORY belongsTo LP_SHIPMENT via shipmentId
  shipment!: LP_SHIPMENT;
  getShipment!: Sequelize.BelongsToGetAssociationMixin<LP_SHIPMENT>;
  setShipment!: Sequelize.BelongsToSetAssociationMixin<LP_SHIPMENT, LP_SHIPMENTId>;
  createShipment!: Sequelize.BelongsToCreateAssociationMixin<LP_SHIPMENT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SHIPMENT_HISTORY {
    return LP_SHIPMENT_HISTORY.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    shipmentId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_SHIPMENT',
        key: 'id'
      },
      field: 'shipment_id'
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
        name: "shipment_id",
        using: "BTREE",
        fields: [
          { name: "shipment_id" },
        ]
      },
    ]
  });
  }
}
