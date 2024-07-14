import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_PRODUCT_FAQAttributes {
  id: string;
  productId: string;
  question: string;
  answer: string;
}

export type LP_PRODUCT_FAQPk = "id";
export type LP_PRODUCT_FAQId = LP_PRODUCT_FAQ[LP_PRODUCT_FAQPk];
export type LP_PRODUCT_FAQOptionalAttributes = "id";
export type LP_PRODUCT_FAQCreationAttributes = Optional<LP_PRODUCT_FAQAttributes, LP_PRODUCT_FAQOptionalAttributes>;

export class LP_PRODUCT_FAQ extends Model<LP_PRODUCT_FAQAttributes, LP_PRODUCT_FAQCreationAttributes> implements LP_PRODUCT_FAQAttributes {
  id!: string;
  productId!: string;
  question!: string;
  answer!: string;

  // LP_PRODUCT_FAQ belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT_FAQ {
    return LP_PRODUCT_FAQ.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_PRODUCT',
        key: 'id'
      },
      field: 'product_id'
    },
    question: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT_FAQ',
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
        name: "fk_product_id_faq",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
  }
}
