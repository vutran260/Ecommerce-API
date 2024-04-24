import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_SELLERAttributes {
  id: string;
  prefectureId?: string;
  storeId?: string;
  email?: string;
  phone?: string;
  password?: string;
  officeName?: string;
  officeNameKana?: string;
  postCode?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_SELLERPk = "id";
export type LP_SELLERId = LP_SELLER[LP_SELLERPk];
export type LP_SELLEROptionalAttributes = "id" | "prefectureId" | "storeId" | "email" | "phone" | "password" | "officeName" | "officeNameKana" | "postCode" | "address" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_SELLERCreationAttributes = Optional<LP_SELLERAttributes, LP_SELLEROptionalAttributes>;

export class LP_SELLER extends Model<LP_SELLERAttributes, LP_SELLERCreationAttributes> implements LP_SELLERAttributes {
  id!: string;
  prefectureId?: string;
  storeId?: string;
  email?: string;
  phone?: string;
  password?: string;
  officeName?: string;
  officeNameKana?: string;
  postCode?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_SELLER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SELLER {
    return LP_SELLER.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    prefectureId: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'prefecture_id'
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: true,
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
    officeName: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'office_name'
    },
    officeNameKana: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'office_name_kana'
    },
    postCode: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'post_code'
    },
    address: {
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
