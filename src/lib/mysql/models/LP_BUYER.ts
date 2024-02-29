import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_USER, LP_USERId } from './LP_USER';

export interface LP_BUYERAttributes {
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

export type LP_BUYERPk = "id";
export type LP_BUYERId = LP_BUYER[LP_BUYERPk];
export type LP_BUYEROptionalAttributes = "email" | "phone" | "password" | "username" | "fullname" | "created_at" | "updated_at" | "deleted_at";
export type LP_BUYERCreationAttributes = Optional<LP_BUYERAttributes, LP_BUYEROptionalAttributes>;

export class LP_BUYER extends Model<LP_BUYERAttributes, LP_BUYERCreationAttributes> implements LP_BUYERAttributes {
  id!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // LP_BUYER belongsTo LP_USER via id
  id_LP_USER!: LP_USER;
  getId_LP_USER!: Sequelize.BelongsToGetAssociationMixin<LP_USER>;
  setId_LP_USER!: Sequelize.BelongsToSetAssociationMixin<LP_USER, LP_USERId>;
  createId_LP_USER!: Sequelize.BelongsToCreateAssociationMixin<LP_USER>;

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
    }
  }, {
    sequelize,
    tableName: 'LP_BUYER',
    timestamps: true,
    paranoid: true,
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
