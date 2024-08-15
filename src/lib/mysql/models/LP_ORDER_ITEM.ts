import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_ORDER_ITEMAttributes {
  id: string;
  orderId?: number;
  productId?: string;
  productName: string;
  productImage: string;
  productDescription: string;
  productOverview: string;
  price?: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_ORDER_ITEMPk = "id";
export type LP_ORDER_ITEMId = LP_ORDER_ITEM[LP_ORDER_ITEMPk];
export type LP_ORDER_ITEMOptionalAttributes = "id" | "orderId" | "productId" | "price" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_ORDER_ITEMCreationAttributes = Optional<LP_ORDER_ITEMAttributes, LP_ORDER_ITEMOptionalAttributes>;

export class LP_ORDER_ITEM extends Model<LP_ORDER_ITEMAttributes, LP_ORDER_ITEMCreationAttributes> implements LP_ORDER_ITEMAttributes {
  id!: string;
  orderId?: number;
  productId?: string;
  productName!: string;
  productImage!: string;
  productDescription!: string;
  productOverview!: string;
  price?: number;
  quantity!: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_ORDER_ITEM belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_ORDER_ITEM belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER_ITEM {
    return LP_ORDER_ITEM.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    },
    productId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_PRODUCT',
        key: 'id'
      },
      field: 'product_id'
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'product_name'
    },
    productImage: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_image'
    },
    productDescription: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_description'
    },
    productOverview: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'product_overview'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
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
    tableName: 'LP_ORDER_ITEM',
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
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "LP_ORDER_ITEM_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
