import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_USER, LP_USERId } from './LP_USER';

export interface LP_SELLERAttributes {
  id: string;
  contact_id: string;
  store_id?: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type LP_SELLERPk = "id";
export type LP_SELLERId = LP_SELLER[LP_SELLERPk];
export type LP_SELLEROptionalAttributes = "store_id" | "email" | "phone" | "password" | "username" | "fullname" | "created_at" | "updated_at" | "deleted_at";
export type LP_SELLERCreationAttributes = Optional<LP_SELLERAttributes, LP_SELLEROptionalAttributes>;

export class LP_SELLER extends Model<LP_SELLERAttributes, LP_SELLERCreationAttributes> implements LP_SELLERAttributes {
  id!: string;
  contact_id!: string;
  store_id?: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // LP_SELLER belongsTo LP_STORE via store_id
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;
  // LP_SELLER belongsTo LP_USER via id
  id_LP_USER!: LP_USER;
  getId_LP_USER!: Sequelize.BelongsToGetAssociationMixin<LP_USER>;
  setId_LP_USER!: Sequelize.BelongsToSetAssociationMixin<LP_USER, LP_USERId>;
  createId_LP_USER!: Sequelize.BelongsToCreateAssociationMixin<LP_USER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SELLER {
    return LP_SELLER.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_USER',
        key: 'id'
      }
    },
    contact_id: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    store_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'LP_STORE',
        key: 'id'
      }
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LP_SELLER',
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
        name: "fk_store_id_seller",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
