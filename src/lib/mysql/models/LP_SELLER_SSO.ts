import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_SELLER, LP_SELLERId } from './LP_SELLER';

export interface LP_SELLER_SSOAttributes {
  sellerId: string;
  username?: string;
  firstNameKanji?: string;
  lastNameKanji?: string;
  firstNameKana?: string;
  lastNameKana?: string;
  birthday?: Date;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_SELLER_SSOPk = 'sellerId';
export type LP_SELLER_SSOId = LP_SELLER_SSO[LP_SELLER_SSOPk];
export type LP_SELLER_SSOOptionalAttributes =
  | 'username'
  | 'firstNameKanji'
  | 'lastNameKanji'
  | 'firstNameKana'
  | 'lastNameKana'
  | 'birthday'
  | 'email'
  | 'createdAt'
  | 'updatedAt';
export type LP_SELLER_SSOCreationAttributes = Optional<
  LP_SELLER_SSOAttributes,
  LP_SELLER_SSOOptionalAttributes
>;

export class LP_SELLER_SSO
  extends Model<LP_SELLER_SSOAttributes, LP_SELLER_SSOCreationAttributes>
  implements LP_SELLER_SSOAttributes
{
  sellerId!: string;
  username?: string;
  firstNameKanji?: string;
  lastNameKanji?: string;
  firstNameKana?: string;
  lastNameKana?: string;
  birthday?: Date;
  email?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_SELLER_SSO belongsTo LP_SELLER via sellerId
  seller!: LP_SELLER;
  getSeller!: Sequelize.BelongsToGetAssociationMixin<LP_SELLER>;
  setSeller!: Sequelize.BelongsToSetAssociationMixin<LP_SELLER, LP_SELLERId>;
  createSeller!: Sequelize.BelongsToCreateAssociationMixin<LP_SELLER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_SELLER_SSO {
    return LP_SELLER_SSO.init(
      {
        sellerId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_SELLER',
            key: 'id',
          },
          field: 'seller_id',
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        firstNameKanji: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'first_name_kanji',
        },
        lastNameKanji: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'last_name_kanji',
        },
        firstNameKana: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'first_name_kana',
        },
        lastNameKana: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'last_name_kana',
        },
        birthday: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
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
        tableName: 'LP_SELLER_SSO',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'seller_id' }],
          },
        ],
      },
    );
  }
}
