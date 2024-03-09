import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_SELLER, LP_SELLERCreationAttributes, LP_SELLERId } from './LP_SELLER';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_USERAttributes {
  id: string;
  contactId: string;
  prefectureId: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  nameKanji?: string;
  nameKana?: string;
  birthday?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_USERPk = "id";
export type LP_USERId = LP_USER[LP_USERPk];
export type LP_USEROptionalAttributes = "id" | "email" | "phone" | "password" | "username" | "fullname" | "nameKanji" | "nameKana" | "birthday" | "address" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_USERCreationAttributes = Optional<LP_USERAttributes, LP_USEROptionalAttributes>;

export class LP_USER extends Model<LP_USERAttributes, LP_USERCreationAttributes> implements LP_USERAttributes {
  id!: string;
  contactId!: string;
  prefectureId!: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  fullname?: string;
  nameKanji?: string;
  nameKana?: string;
  birthday?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_USER hasMany LP_BUYER via id
  lpBuyers!: LP_BUYER[];
  getLpBuyers!: Sequelize.HasManyGetAssociationsMixin<LP_BUYER>;
  setLpBuyers!: Sequelize.HasManySetAssociationsMixin<LP_BUYER, LP_BUYERId>;
  addLpBuyer!: Sequelize.HasManyAddAssociationMixin<LP_BUYER, LP_BUYERId>;
  addLpBuyers!: Sequelize.HasManyAddAssociationsMixin<LP_BUYER, LP_BUYERId>;
  createLpBuyer!: Sequelize.HasManyCreateAssociationMixin<LP_BUYER>;
  removeLpBuyer!: Sequelize.HasManyRemoveAssociationMixin<LP_BUYER, LP_BUYERId>;
  removeLpBuyers!: Sequelize.HasManyRemoveAssociationsMixin<LP_BUYER, LP_BUYERId>;
  hasLpBuyer!: Sequelize.HasManyHasAssociationMixin<LP_BUYER, LP_BUYERId>;
  hasLpBuyers!: Sequelize.HasManyHasAssociationsMixin<LP_BUYER, LP_BUYERId>;
  countLpBuyers!: Sequelize.HasManyCountAssociationsMixin;
  // LP_USER hasOne LP_SELLER via id
  lpSeller!: LP_SELLER;
  getLpSeller!: Sequelize.HasOneGetAssociationMixin<LP_SELLER>;
  setLpSeller!: Sequelize.HasOneSetAssociationMixin<LP_SELLER, LP_SELLERId>;
  createLpSeller!: Sequelize.HasOneCreateAssociationMixin<LP_SELLER>;
  // LP_USER belongsToMany LP_STORE via id and storeId
  storeIdLpStores!: LP_STORE[];
  getStoreIdLpStores!: Sequelize.BelongsToManyGetAssociationsMixin<LP_STORE>;
  setStoreIdLpStores!: Sequelize.BelongsToManySetAssociationsMixin<LP_STORE, LP_STOREId>;
  addStoreIdLpStore!: Sequelize.BelongsToManyAddAssociationMixin<LP_STORE, LP_STOREId>;
  addStoreIdLpStores!: Sequelize.BelongsToManyAddAssociationsMixin<LP_STORE, LP_STOREId>;
  createStoreIdLpStore!: Sequelize.BelongsToManyCreateAssociationMixin<LP_STORE>;
  removeStoreIdLpStore!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_STORE, LP_STOREId>;
  removeStoreIdLpStores!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_STORE, LP_STOREId>;
  hasStoreIdLpStore!: Sequelize.BelongsToManyHasAssociationMixin<LP_STORE, LP_STOREId>;
  hasStoreIdLpStores!: Sequelize.BelongsToManyHasAssociationsMixin<LP_STORE, LP_STOREId>;
  countStoreIdLpStores!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_USER {
    return LP_USER.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    contactId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "contact_id",
      field: 'contact_id'
    },
    prefectureId: {
      type: DataTypes.STRING(225),
      allowNull: false,
      field: 'prefecture_id'
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
    nameKanji: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'name_kanji'
    },
    nameKana: {
      type: DataTypes.STRING(225),
      allowNull: true,
      field: 'name_kana'
    },
    birthday: {
      type: DataTypes.STRING(225),
      allowNull: true
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
      {
        name: "contact_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contact_id" },
        ]
      },
    ]
  });
  }
}
