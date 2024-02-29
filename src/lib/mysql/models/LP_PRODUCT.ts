import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_PRODUCTAttributes {
  id: string;
  product_name?: string;
  product_tag?: string;
  product_type?: string;
  stock?: string;
  price?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type LP_PRODUCTPk = "id";
export type LP_PRODUCTId = LP_PRODUCT[LP_PRODUCTPk];
export type LP_PRODUCTOptionalAttributes = "product_name" | "product_tag" | "product_type" | "stock" | "price" | "status" | "created_at" | "updated_at" | "deleted_at";
export type LP_PRODUCTCreationAttributes = Optional<LP_PRODUCTAttributes, LP_PRODUCTOptionalAttributes>;

export class LP_PRODUCT extends Model<LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes> implements LP_PRODUCTAttributes {
  id!: string;
  product_name?: string;
  product_tag?: string;
  product_type?: string;
  stock?: string;
  price?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT {
    return LP_PRODUCT.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_tag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stock: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
