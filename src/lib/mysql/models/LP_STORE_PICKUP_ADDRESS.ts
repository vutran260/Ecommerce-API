import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_STORE_ADDRESS, LP_STORE_ADDRESSId } from './LP_STORE_ADDRESS';

export interface LP_STORE_PICKUP_ADDRESSAttributes {
  id: string;
  orderId?: string;
  storeAddressId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_STORE_PICKUP_ADDRESSPk = "id";
export type LP_STORE_PICKUP_ADDRESSId = LP_STORE_PICKUP_ADDRESS[LP_STORE_PICKUP_ADDRESSPk];
export type LP_STORE_PICKUP_ADDRESSOptionalAttributes = "id" | "orderId" | "storeAddressId" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_STORE_PICKUP_ADDRESSCreationAttributes = Optional<LP_STORE_PICKUP_ADDRESSAttributes, LP_STORE_PICKUP_ADDRESSOptionalAttributes>;

export class LP_STORE_PICKUP_ADDRESS extends Model<LP_STORE_PICKUP_ADDRESSAttributes, LP_STORE_PICKUP_ADDRESSCreationAttributes> implements LP_STORE_PICKUP_ADDRESSAttributes {
  id!: string;
  orderId?: string;
  storeAddressId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_STORE_PICKUP_ADDRESS belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_STORE_PICKUP_ADDRESS belongsTo LP_STORE_ADDRESS via storeAddressId
  storeAddress!: LP_STORE_ADDRESS;
  getStoreAddress!: Sequelize.BelongsToGetAssociationMixin<LP_STORE_ADDRESS>;
  setStoreAddress!: Sequelize.BelongsToSetAssociationMixin<LP_STORE_ADDRESS, LP_STORE_ADDRESSId>;
  createStoreAddress!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE_ADDRESS>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_PICKUP_ADDRESS {
    return LP_STORE_PICKUP_ADDRESS.init({
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
    storeAddressId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_STORE_ADDRESS',
        key: 'id'
      },
      field: 'store_address_id'
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
    tableName: 'LP_STORE_PICKUP_ADDRESS',
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
      {
        name: "store_address_id",
        using: "BTREE",
        fields: [
          { name: "store_address_id" },
        ]
      },
    ]
  });
  }
}
