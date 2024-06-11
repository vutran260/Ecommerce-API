import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_PRODUCT_COMPONENTAttributes {
  id: string;
  productId: string;
  amount: number;
  unit?: string;
}

export type LP_PRODUCT_COMPONENTPk = "id";
export type LP_PRODUCT_COMPONENTId = LP_PRODUCT_COMPONENT[LP_PRODUCT_COMPONENTPk];
export type LP_PRODUCT_COMPONENTOptionalAttributes = "id" | "unit";
export type LP_PRODUCT_COMPONENTCreationAttributes = Optional<LP_PRODUCT_COMPONENTAttributes, LP_PRODUCT_COMPONENTOptionalAttributes>;

export class LP_PRODUCT_COMPONENT extends Model<LP_PRODUCT_COMPONENTAttributes, LP_PRODUCT_COMPONENTCreationAttributes> implements LP_PRODUCT_COMPONENTAttributes {
  id!: string;
  productId!: string;
  amount!: number;
  unit?: string;

  // LP_PRODUCT_COMPONENT belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT_COMPONENT {
    return LP_PRODUCT_COMPONENT.init({
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
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT_COMPONENT',
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
        name: "fk_product_id_component",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
  }
}
