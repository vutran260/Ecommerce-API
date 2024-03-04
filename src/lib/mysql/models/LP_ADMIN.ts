import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_ADMINAttributes {
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

export type LP_ADMINPk = "id";
export type LP_ADMINId = LP_ADMIN[LP_ADMINPk];
export type LP_ADMINOptionalAttributes = "email" | "phone" | "password" | "username" | "fullname" | "created_at" | "updated_at" | "deleted_at";
export type LP_ADMINCreationAttributes = Optional<LP_ADMINAttributes, LP_ADMINOptionalAttributes>;

export class LP_ADMIN extends Model<LP_ADMINAttributes, LP_ADMINCreationAttributes> implements LP_ADMINAttributes {
  id!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ADMIN {
    return LP_ADMIN.init({
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
