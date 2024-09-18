import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_SUBSCRIPTION, LP_SUBSCRIPTIONId } from './LP_SUBSCRIPTION';

export interface LP_SUBSCRIPTION_ADDRESSAttributes {
  subscriptionId: string;
  firstNameKana: string;
  lastNameKana: string;
  firstNameKanji: string;
  lastNameKanji: string;
  gender?: number;
  prefectureCode: string;
  prefectureName?: string;
  postCode: string;
  cityTown: string;
  streetAddress: string;
  buildingName: string;
  email: string;
  telephoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SUBSCRIPTION_ADDRESSPk = 'subscriptionId';
export type LP_SUBSCRIPTION_ADDRESSId =
  LP_SUBSCRIPTION_ADDRESS[LP_SUBSCRIPTION_ADDRESSPk];
export type LP_SUBSCRIPTION_ADDRESSOptionalAttributes =
  | 'gender'
  | 'prefectureName'
  | 'createdAt'
  | 'updatedAt';
export type LP_SUBSCRIPTION_ADDRESSCreationAttributes = Optional<
  LP_SUBSCRIPTION_ADDRESSAttributes,
  LP_SUBSCRIPTION_ADDRESSOptionalAttributes
>;

export class LP_SUBSCRIPTION_ADDRESS
  extends Model<
    LP_SUBSCRIPTION_ADDRESSAttributes,
    LP_SUBSCRIPTION_ADDRESSCreationAttributes
  >
  implements LP_SUBSCRIPTION_ADDRESSAttributes
{
  subscriptionId!: string;
  firstNameKana!: string;
  lastNameKana!: string;
  firstNameKanji!: string;
  lastNameKanji!: string;
  gender?: number;
  prefectureCode!: string;
  prefectureName?: string;
  postCode!: string;
  cityTown!: string;
  streetAddress!: string;
  buildingName!: string;
  email!: string;
  telephoneNumber!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SUBSCRIPTION_ADDRESS belongsTo LP_SUBSCRIPTION via subscriptionId
  subscription!: LP_SUBSCRIPTION;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<LP_SUBSCRIPTION>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    LP_SUBSCRIPTION,
    LP_SUBSCRIPTIONId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<LP_SUBSCRIPTION>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_SUBSCRIPTION_ADDRESS {
    return LP_SUBSCRIPTION_ADDRESS.init(
      {
        subscriptionId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_SUBSCRIPTION',
            key: 'id',
          },
          field: 'subscription_id',
        },
        firstNameKana: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'first_name_kana',
        },
        lastNameKana: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'last_name_kana',
        },
        firstNameKanji: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'first_name_kanji',
        },
        lastNameKanji: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'last_name_kanji',
        },
        gender: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: true,
        },
        prefectureCode: {
          type: DataTypes.CHAR(2),
          allowNull: false,
          field: 'prefecture_code',
        },
        prefectureName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'prefecture_name',
        },
        postCode: {
          type: DataTypes.STRING(36),
          allowNull: false,
          field: 'post_code',
        },
        cityTown: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'city_town',
        },
        streetAddress: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'street_address',
        },
        buildingName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'building_name',
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        telephoneNumber: {
          type: DataTypes.STRING(36),
          allowNull: false,
          field: 'telephone_number',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_SUBSCRIPTION_ADDRESS',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }],
          },
        ],
      },
    );
  }
}
