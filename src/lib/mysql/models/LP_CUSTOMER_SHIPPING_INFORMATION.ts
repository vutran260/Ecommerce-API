import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';

export interface LP_CUSTOMER_SHIPPING_INFORMATIONAttributes {
  id: string;
  buyerId: string;
  nameKana: string;
  nameKanji: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
}

export type LP_CUSTOMER_SHIPPING_INFORMATIONPk = "id";
export type LP_CUSTOMER_SHIPPING_INFORMATIONId = LP_CUSTOMER_SHIPPING_INFORMATION[LP_CUSTOMER_SHIPPING_INFORMATIONPk];
export type LP_CUSTOMER_SHIPPING_INFORMATIONOptionalAttributes = "id";
export type LP_CUSTOMER_SHIPPING_INFORMATIONCreationAttributes = Optional<LP_CUSTOMER_SHIPPING_INFORMATIONAttributes, LP_CUSTOMER_SHIPPING_INFORMATIONOptionalAttributes>;

export class LP_CUSTOMER_SHIPPING_INFORMATION extends Model<LP_CUSTOMER_SHIPPING_INFORMATIONAttributes, LP_CUSTOMER_SHIPPING_INFORMATIONCreationAttributes> implements LP_CUSTOMER_SHIPPING_INFORMATIONAttributes {
  id!: string;
  buyerId!: string;
  nameKana!: string;
  nameKanji!: string;
  postCode!: string;
  cityTown!: string;
  streetAddress!: string;
  buildingName!: string;
  email!: string;
  telephoneNumber!: string;

  // LP_CUSTOMER_SHIPPING_INFORMATION belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_CUSTOMER_SHIPPING_INFORMATION {
    return LP_CUSTOMER_SHIPPING_INFORMATION.init({
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
    tableName: 'LP_CUSTOMER_SHIPPING_INFORMATION',
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
    ]
  });
  }
}
