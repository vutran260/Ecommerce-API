import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_ORDER_ADDRESS_BUYERAttributes {
  orderId: string;
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

export type LP_ORDER_ADDRESS_BUYERPk = "orderId";
export type LP_ORDER_ADDRESS_BUYERId = LP_ORDER_ADDRESS_BUYER[LP_ORDER_ADDRESS_BUYERPk];
export type LP_ORDER_ADDRESS_BUYEROptionalAttributes = "createdAt" | "updatedAt";
export type LP_ORDER_ADDRESS_BUYERCreationAttributes = Optional<LP_ORDER_ADDRESS_BUYERAttributes, LP_ORDER_ADDRESS_BUYEROptionalAttributes>;

export class LP_ORDER_ADDRESS_BUYER extends Model<LP_ORDER_ADDRESS_BUYERAttributes, LP_ORDER_ADDRESS_BUYERCreationAttributes> implements LP_ORDER_ADDRESS_BUYERAttributes {
  orderId!: string;
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
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
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
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
