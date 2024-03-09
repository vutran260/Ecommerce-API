import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_ADMINAttributes {
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_ADMINPk = "id";
export type LP_ADMINId = LP_ADMIN[LP_ADMINPk];
export type LP_ADMINOptionalAttributes = "id" | "email" | "phone" | "password" | "username" | "fullname" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_ADMINCreationAttributes = Optional<LP_ADMINAttributes, LP_ADMINOptionalAttributes>;

export class LP_ADMIN extends Model<LP_ADMINAttributes, LP_ADMINCreationAttributes> implements LP_ADMINAttributes {
  id!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ADMIN {
    return LP_ADMIN.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
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
    tableName: 'LP_ADMIN',
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
