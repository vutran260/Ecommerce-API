import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_ADDRESS_BUYERAttributes {
  id: string;
  buyerId: string;
  storeId: string;
  nameKana: string;
  nameKanji: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
}

export type LP_ADDRESS_BUYERPk = "id";
export type LP_ADDRESS_BUYERId = LP_ADDRESS_BUYER[LP_ADDRESS_BUYERPk];
export type LP_ADDRESS_BUYEROptionalAttributes = "id";
export type LP_ADDRESS_BUYERCreationAttributes = Optional<LP_ADDRESS_BUYERAttributes, LP_ADDRESS_BUYEROptionalAttributes>;

export class LP_ADDRESS_BUYER extends Model<LP_ADDRESS_BUYERAttributes, LP_ADDRESS_BUYERCreationAttributes> implements LP_ADDRESS_BUYERAttributes {
  id!: string;
  buyerId!: string;
  storeId!: string;
  nameKana!: string;
  nameKanji!: string;
  postCode!: string;
  cityTown!: string;
  streetAddress!: string;
  buildingName!: string;
  email!: string;
  telephoneNumber!: string;

  // LP_ADDRESS_BUYER belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_ADDRESS_BUYER belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ADDRESS_BUYER {
    return LP_ADDRESS_BUYER.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_BUYER',
        key: 'id'
      },
      field: 'buyer_id'
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
    nameKana: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name_kana'
    },
    nameKanji: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name_kanji'
    },
    postCode: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'post_code'
    },
    cityTown: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'city_town'
    },
    streetAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'street_address'
    },
    buildingName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'building_name'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephoneNumber: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'telephone_number'
    }
  }, {
    sequelize,
    tableName: 'LP_ADDRESS_BUYER',
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
        name: "fk_buyer_id",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
      {
        name: "fk_store_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
