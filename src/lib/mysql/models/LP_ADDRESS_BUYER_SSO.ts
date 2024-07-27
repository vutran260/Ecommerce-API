import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';

export interface LP_ADDRESS_BUYER_SSOAttributes {
  buyerId: string;
  email: string;
  telephoneNumber: string;
  contactTelephoneNumber: string;
  postCode: string;
  prefectureCode: string;
  cityTown: string;
  buildingName: string;
}

export type LP_ADDRESS_BUYER_SSOPk = "buyerId";
export type LP_ADDRESS_BUYER_SSOId = LP_ADDRESS_BUYER_SSO[LP_ADDRESS_BUYER_SSOPk];
export type LP_ADDRESS_BUYER_SSOCreationAttributes = LP_ADDRESS_BUYER_SSOAttributes;

export class LP_ADDRESS_BUYER_SSO extends Model<LP_ADDRESS_BUYER_SSOAttributes, LP_ADDRESS_BUYER_SSOCreationAttributes> implements LP_ADDRESS_BUYER_SSOAttributes {
  buyerId!: string;
  email!: string;
  telephoneNumber!: string;
  contactTelephoneNumber!: string;
  postCode!: string;
  prefectureCode!: string;
  cityTown!: string;
  buildingName!: string;

  // LP_ADDRESS_BUYER_SSO belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ADDRESS_BUYER_SSO {
    return LP_ADDRESS_BUYER_SSO.init({
    buyerId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_BUYER',
        key: 'id'
      },
      field: 'buyer_id'
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telephoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'telephone_number'
    },
    contactTelephoneNumber: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'contact_telephone_number'
    },
    postCode: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'post_code'
    },
    prefectureCode: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      field: 'prefecture_code'
    },
    cityTown: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'city_town'
    },
    buildingName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'building_name'
    }
  }, {
    sequelize,
    tableName: 'LP_ADDRESS_BUYER_SSO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
    ]
  });
  }
}
