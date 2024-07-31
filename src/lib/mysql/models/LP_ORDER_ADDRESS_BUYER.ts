import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_ORDER_ADDRESS_BUYERAttributes {
  id: string;
  orderId?: string;
  nameKana: string;
  nameKanji: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type LP_ORDER_ADDRESS_BUYERPk = "id";
export type LP_ORDER_ADDRESS_BUYERId = LP_ORDER_ADDRESS_BUYER[LP_ORDER_ADDRESS_BUYERPk];
export type LP_ORDER_ADDRESS_BUYEROptionalAttributes = "id" | "orderId" | "createdAt" | "updatedAt";
export type LP_ORDER_ADDRESS_BUYERCreationAttributes = Optional<LP_ORDER_ADDRESS_BUYERAttributes, LP_ORDER_ADDRESS_BUYEROptionalAttributes>;

export class LP_ORDER_ADDRESS_BUYER extends Model<LP_ORDER_ADDRESS_BUYERAttributes, LP_ORDER_ADDRESS_BUYERCreationAttributes> implements LP_ORDER_ADDRESS_BUYERAttributes {
  id!: string;
  orderId?: string;
  nameKana!: string;
  nameKanji!: string;
  postCode!: string;
  cityTown!: string;
  streetAddress!: string;
  buildingName!: string;
  email!: string;
  telephoneNumber!: string;
  createdAt?: Date;
  updatedAt?: Date;

  // LP_ORDER_ADDRESS_BUYER belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER_ADDRESS_BUYER {
    return LP_ORDER_ADDRESS_BUYER.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      unique: "LP_ORDER_ADDRESS_BUYER_ibfk_1",
      field: 'order_id'
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
    }
  }, {
    sequelize,
    tableName: 'LP_ORDER_ADDRESS_BUYER',
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
        name: "order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
