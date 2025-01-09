import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_PRODUCT_SPECIAL_QUESTIONSAttributes {
  id: number;
  question?: string;
  type?: string;
  answerTemplate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_PRODUCT_SPECIAL_QUESTIONSPk = 'id';
export type LP_PRODUCT_SPECIAL_QUESTIONSId =
  LP_PRODUCT_SPECIAL_QUESTIONS[LP_PRODUCT_SPECIAL_QUESTIONSPk];
export type LP_PRODUCT_SPECIAL_QUESTIONSOptionalAttributes =
  | 'id'
  | 'question'
  | 'type'
  | 'answerTemplate'
  | 'createdAt'
  | 'updatedAt';
export type LP_PRODUCT_SPECIAL_QUESTIONSCreationAttributes = Optional<
  LP_PRODUCT_SPECIAL_QUESTIONSAttributes,
  LP_PRODUCT_SPECIAL_QUESTIONSOptionalAttributes
>;

export class LP_PRODUCT_SPECIAL_QUESTIONS
  extends Model<
    LP_PRODUCT_SPECIAL_QUESTIONSAttributes,
    LP_PRODUCT_SPECIAL_QUESTIONSCreationAttributes
  >
  implements LP_PRODUCT_SPECIAL_QUESTIONSAttributes
{
  id!: number;
  question?: string;
  type?: string;
  answerTemplate?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_PRODUCT_SPECIAL_QUESTIONS {
    return LP_PRODUCT_SPECIAL_QUESTIONS.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        question: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        answerTemplate: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'answer_template',
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
        tableName: 'LP_PRODUCT_SPECIAL_QUESTIONS',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
