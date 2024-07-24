import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';

export interface LP_BUYER_PERSONAL_INFORMATIONAttributes {
  buyerId: string;
  nickname: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  prefectureCode: string;
  gender?: number;
  birthday?: string;
  age?: string;
}

export type LP_BUYER_PERSONAL_INFORMATIONPk = "buyerId";
export type LP_BUYER_PERSONAL_INFORMATIONId = LP_BUYER_PERSONAL_INFORMATION[LP_BUYER_PERSONAL_INFORMATIONPk];
export type LP_BUYER_PERSONAL_INFORMATIONOptionalAttributes = "gender" | "birthday" | "age";
export type LP_BUYER_PERSONAL_INFORMATIONCreationAttributes = Optional<LP_BUYER_PERSONAL_INFORMATIONAttributes, LP_BUYER_PERSONAL_INFORMATIONOptionalAttributes>;

export class LP_BUYER_PERSONAL_INFORMATION extends Model<LP_BUYER_PERSONAL_INFORMATIONAttributes, LP_BUYER_PERSONAL_INFORMATIONCreationAttributes> implements LP_BUYER_PERSONAL_INFORMATIONAttributes {
  buyerId!: string;
  nickname!: string;
  firstName!: string;
  lastName!: string;
  firstNameKana!: string;
  lastNameKana!: string;
  prefectureCode!: string;
  gender?: number;
  birthday?: string;
  age?: string;

  // LP_BUYER_PERSONAL_INFORMATION belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_BUYER_PERSONAL_INFORMATION {
    return LP_BUYER_PERSONAL_INFORMATION.init({
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
    nickname: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'NICKNAME'
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'FIRST_NAME'
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'LAST_NAME'
    },
    firstNameKana: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'FIRST_NAME_KANA'
    },
    lastNameKana: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'LAST_NAME_KANA'
    },
    prefectureCode: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      field: 'prefecture_code'
    },
    gender: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      field: 'GENDER'
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'BIRTHDAY'
    },
    age: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      field: 'AGE'
    }
  }, {
    sequelize,
    tableName: 'LP_BUYER_PERSONAL_INFORMATION',
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
