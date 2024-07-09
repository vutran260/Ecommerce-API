import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';

export interface LP_BUYER_ADDRESSAttributes {
  id: string;
  buyerId?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  postalCode?: number;
  city?: string;
  ward?: string;
  town?: string;
  village?: string;
  block?: string;
  emailAddress?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_BUYER_ADDRESSPk = "id";
export type LP_BUYER_ADDRESSId = LP_BUYER_ADDRESS[LP_BUYER_ADDRESSPk];
export type LP_BUYER_ADDRESSOptionalAttributes = "id" | "buyerId" | "firstName" | "lastName" | "gender" | "postalCode" | "city" | "ward" | "town" | "village" | "block" | "emailAddress" | "phoneNumber" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_BUYER_ADDRESSCreationAttributes = Optional<LP_BUYER_ADDRESSAttributes, LP_BUYER_ADDRESSOptionalAttributes>;

export class LP_BUYER_ADDRESS extends Model<LP_BUYER_ADDRESSAttributes, LP_BUYER_ADDRESSCreationAttributes> implements LP_BUYER_ADDRESSAttributes {
  id!: string;
  buyerId?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  postalCode?: number;
  city?: string;
  ward?: string;
  town?: string;
  village?: string;
  block?: string;
  emailAddress?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_BUYER_ADDRESS belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_BUYER_ADDRESS {
    return LP_BUYER_ADDRESS.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_BUYER',
        key: 'id'
      },
      field: 'buyer_id'
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'last_name'
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    postalCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'postal_code'
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    town: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    village: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    block: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email_address'
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'phone_number'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_BUYER_ADDRESS',
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
        name: "buyer_id",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
    ]
  });
  }
}
