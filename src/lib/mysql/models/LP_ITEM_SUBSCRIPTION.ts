import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_ITEM_SUBSCRIPTIONAttributes {
  id: string;
  productId?: string;
  orderId?: string;
}

export type LP_ITEM_SUBSCRIPTIONPk = "id";
export type LP_ITEM_SUBSCRIPTIONId = LP_ITEM_SUBSCRIPTION[LP_ITEM_SUBSCRIPTIONPk];
export type LP_ITEM_SUBSCRIPTIONOptionalAttributes = "id" | "productId" | "orderId";
export type LP_ITEM_SUBSCRIPTIONCreationAttributes = Optional<LP_ITEM_SUBSCRIPTIONAttributes, LP_ITEM_SUBSCRIPTIONOptionalAttributes>;

export class LP_ITEM_SUBSCRIPTION extends Model<LP_ITEM_SUBSCRIPTIONAttributes, LP_ITEM_SUBSCRIPTIONCreationAttributes> implements LP_ITEM_SUBSCRIPTIONAttributes {
  id!: string;
  productId?: string;
  orderId?: string;

  // LP_ITEM_SUBSCRIPTION belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_ITEM_SUBSCRIPTION belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ITEM_SUBSCRIPTION {
    return LP_ITEM_SUBSCRIPTION.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    }
  }, {
    sequelize,
    tableName: 'LP_ITEM_SUBSCRIPTION',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
  }
}
