import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERCreationAttributes, LP_BUYERId } from './LP_BUYER';
import type { LP_SELLER, LP_SELLERCreationAttributes, LP_SELLERId } from './LP_SELLER';

export interface LP_USERAttributes {
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type LP_USERPk = "id";
export type LP_USERId = LP_USER[LP_USERPk];
export type LP_USEROptionalAttributes = "email" | "phone" | "password" | "username" | "fullname" | "created_at" | "updated_at" | "deleted_at";
export type LP_USERCreationAttributes = Optional<LP_USERAttributes, LP_USEROptionalAttributes>;

export class LP_USER extends Model<LP_USERAttributes, LP_USERCreationAttributes> implements LP_USERAttributes {
  id!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // LP_USER hasOne LP_BUYER via id
  LP_BUYER!: LP_BUYER;
  getLP_BUYER!: Sequelize.HasOneGetAssociationMixin<LP_BUYER>;
  setLP_BUYER!: Sequelize.HasOneSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createLP_BUYER!: Sequelize.HasOneCreateAssociationMixin<LP_BUYER>;
  // LP_USER hasOne LP_SELLER via id
  LP_SELLER!: LP_SELLER;
  getLP_SELLER!: Sequelize.HasOneGetAssociationMixin<LP_SELLER>;
  setLP_SELLER!: Sequelize.HasOneSetAssociationMixin<LP_SELLER, LP_SELLERId>;
  createLP_SELLER!: Sequelize.HasOneCreateAssociationMixin<LP_SELLER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_USER {
    return LP_USER.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
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
    tableName: 'LP_USER',
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
    ]
  });
  }
}
