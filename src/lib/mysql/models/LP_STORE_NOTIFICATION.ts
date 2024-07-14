import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_STORE_NOTIFICATIONAttributes {
  id: string;
  storeId: string;
  notificationImage: string;
  title: string;
  details: string;
  status?: string;
}

export type LP_STORE_NOTIFICATIONPk = "id";
export type LP_STORE_NOTIFICATIONId = LP_STORE_NOTIFICATION[LP_STORE_NOTIFICATIONPk];
export type LP_STORE_NOTIFICATIONOptionalAttributes = "id" | "status";
export type LP_STORE_NOTIFICATIONCreationAttributes = Optional<LP_STORE_NOTIFICATIONAttributes, LP_STORE_NOTIFICATIONOptionalAttributes>;

export class LP_STORE_NOTIFICATION extends Model<LP_STORE_NOTIFICATIONAttributes, LP_STORE_NOTIFICATIONCreationAttributes> implements LP_STORE_NOTIFICATIONAttributes {
  id!: string;
  storeId!: string;
  notificationImage!: string;
  title!: string;
  details!: string;
  status?: string;

  // LP_STORE_NOTIFICATION belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_NOTIFICATION {
    return LP_STORE_NOTIFICATION.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    notificationImage: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'notification_image'
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LP_STORE_NOTIFICATION',
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
        name: "store_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
