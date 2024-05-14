import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_PRODUCT_OPTIONAttributes {
  productId: string;
  optionType: string;
  optionValue: string;
  optionOrder: number;
}

export type LP_PRODUCT_OPTIONPk = "productId" | "optionType";
export type LP_PRODUCT_OPTIONId = LP_PRODUCT_OPTION[LP_PRODUCT_OPTIONPk];
export type LP_PRODUCT_OPTIONCreationAttributes = LP_PRODUCT_OPTIONAttributes;

export class LP_PRODUCT_OPTION extends Model<LP_PRODUCT_OPTIONAttributes, LP_PRODUCT_OPTIONCreationAttributes> implements LP_PRODUCT_OPTIONAttributes {
  productId!: string;
  optionType!: string;
  optionValue!: string;
  optionOrder!: number;

  // LP_PRODUCT_OPTION belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT_OPTION {
    return LP_PRODUCT_OPTION.init({
    productId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LP_PRODUCT',
        key: 'id'
      },
      field: 'product_id'
    },
    optionType: {
      type: DataTypes.STRING(72),
      allowNull: false,
      primaryKey: true,
      field: 'option_type'
    },
    optionValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'option_value'
    },
    optionOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'option_order'
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT_OPTION',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
          { name: "option_type" },
        ]
      },
    ]
  });
  }
}
