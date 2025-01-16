import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_CART, LP_CARTId } from './LP_CART';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCT_SPECIAL_FAQAttributes {
  id: number;
  buyerId: string;
  storeId: string;
  productId: string;
  status: string;
  question1: number;
  answer1: string;
  question2: number;
  answer2: string;
  question3: number;
  answer3: string;
  question4: number;
  answer4: string;
  question5: number;
  answer5: string;
  question6: number;
  answer6: string;
  question7: number;
  answer7: string;
  question8: number;
  answer8: string;
  question9: number;
  answer9: string;
  question10: number;
  answer10: string;
  question11: number;
  answer11: string;
  question12: number;
  answer12: string;
  question13: number;
  answer13: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_PRODUCT_SPECIAL_FAQPk = 'id';
export type LP_PRODUCT_SPECIAL_FAQId =
  LP_PRODUCT_SPECIAL_FAQ[LP_PRODUCT_SPECIAL_FAQPk];
export type LP_PRODUCT_SPECIAL_FAQOptionalAttributes =
  | 'id'
  | 'status'
  | 'createdAt'
  | 'updatedAt';
export type LP_PRODUCT_SPECIAL_FAQCreationAttributes = Optional<
  LP_PRODUCT_SPECIAL_FAQAttributes,
  LP_PRODUCT_SPECIAL_FAQOptionalAttributes
>;

export class LP_PRODUCT_SPECIAL_FAQ
  extends Model<
    LP_PRODUCT_SPECIAL_FAQAttributes,
    LP_PRODUCT_SPECIAL_FAQCreationAttributes
  >
  implements LP_PRODUCT_SPECIAL_FAQAttributes
{
  id!: number;
  buyerId!: string;
  storeId!: string;
  productId!: string;
  status!: string;
  question1!: number;
  answer1!: string;
  question2!: number;
  answer2!: string;
  question3!: number;
  answer3!: string;
  question4!: number;
  answer4!: string;
  question5!: number;
  answer5!: string;
  question6!: number;
  answer6!: string;
  question7!: number;
  answer7!: string;
  question8!: number;
  answer8!: string;
  question9!: number;
  answer9!: string;
  question10!: number;
  answer10!: string;
  question11!: number;
  answer11!: string;
  question12!: number;
  answer12!: string;
  question13!: number;
  answer13!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_PRODUCT_SPECIAL_FAQ belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_PRODUCT_SPECIAL_FAQ belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;
  // LP_PRODUCT_SPECIAL_FAQ hasMany LP_CART via faqId
  lpCarts!: LP_CART[];
  getLpCarts!: Sequelize.HasManyGetAssociationsMixin<LP_CART>;
  setLpCarts!: Sequelize.HasManySetAssociationsMixin<LP_CART, LP_CARTId>;
  addLpCart!: Sequelize.HasManyAddAssociationMixin<LP_CART, LP_CARTId>;
  addLpCarts!: Sequelize.HasManyAddAssociationsMixin<LP_CART, LP_CARTId>;
  createLpCart!: Sequelize.HasManyCreateAssociationMixin<LP_CART>;
  removeLpCart!: Sequelize.HasManyRemoveAssociationMixin<LP_CART, LP_CARTId>;
  removeLpCarts!: Sequelize.HasManyRemoveAssociationsMixin<LP_CART, LP_CARTId>;
  hasLpCart!: Sequelize.HasManyHasAssociationMixin<LP_CART, LP_CARTId>;
  hasLpCarts!: Sequelize.HasManyHasAssociationsMixin<LP_CART, LP_CARTId>;
  countLpCarts!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT_SPECIAL_FAQ belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_PRODUCT_SPECIAL_FAQ {
    return LP_PRODUCT_SPECIAL_FAQ.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        buyerId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_BUYER',
            key: 'id',
          },
          field: 'buyer_id',
        },
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
        productId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_PRODUCT',
            key: 'id',
          },
          field: 'product_id',
        },
        status: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: 'NEW',
        },
        question1: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_1',
        },
        answer1: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_1',
        },
        question2: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_2',
        },
        answer2: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_2',
        },
        question3: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_3',
        },
        answer3: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_3',
        },
        question4: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_4',
        },
        answer4: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_4',
        },
        question5: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_5',
        },
        answer5: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_5',
        },
        question6: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_6',
        },
        answer6: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_6',
        },
        question7: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_7',
        },
        answer7: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_7',
        },
        question8: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_8',
        },
        answer8: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_8',
        },
        question9: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_9',
        },
        answer9: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_9',
        },
        question10: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_10',
        },
        answer10: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_10',
        },
        question11: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_11',
        },
        answer11: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_11',
        },
        question12: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_12',
        },
        answer12: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_12',
        },
        question13: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'question_13',
        },
        answer13: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'answer_13',
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
        tableName: 'LP_PRODUCT_SPECIAL_FAQ',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'buyer_id',
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }],
          },
          {
            name: 'store_id',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
          {
            name: 'product_id',
            using: 'BTREE',
            fields: [{ name: 'product_id' }],
          },
        ],
      },
    );
  }
}
