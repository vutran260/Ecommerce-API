import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_USER, LP_USERId } from './LP_USER';

export interface LP_BUYERAttributes {
  id: string;
  storeId: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_BUYERPk = "id" | "storeId";
export type LP_BUYERId = LP_BUYER[LP_BUYERPk];
export type LP_BUYEROptionalAttributes = "email" | "phone" | "password" | "username" | "fullname" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_BUYERCreationAttributes = Optional<LP_BUYERAttributes, LP_BUYEROptionalAttributes>;

export class LP_BUYER extends Model<LP_BUYERAttributes, LP_BUYERCreationAttributes> implements LP_BUYERAttributes {
  id!: string;
  storeId!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_BUYER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;
  // LP_BUYER belongsTo LP_USER via id
  idLpUser!: LP_USER;
  getIdLpUser!: Sequelize.BelongsToGetAssociationMixin<LP_USER>;
  setIdLpUser!: Sequelize.BelongsToSetAssociationMixin<LP_USER, LP_USERId>;
  createIdLpUser!: Sequelize.BelongsToCreateAssociationMixin<LP_USER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_BUYER {
    return LP_BUYER.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_USER',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_BUYER',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "store_id" },
        ]
      },
      {
        name: "fk_store_id_buyer",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
