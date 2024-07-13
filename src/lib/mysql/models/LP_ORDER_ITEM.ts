import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_ORDER_ITEMAttributes {
  id: string;
  orderId?: string;
  buyingPeriod?: string;
  isDiscount: number;
  discountPercentage?: number;
  hasDiscountSchedule?: number;
  discountTimeFrom?: Date;
  discountTimeTo?: Date;
  productName: string;
  productImage: string;
  productDescription: string;
  price?: number;
  priceSubscription?: number;
  cost?: number;
  productTag?: string;
  quantity: number;
  capacity?: string;
  expirationUseDate?: Date;
  storageMethod?: string;
  intakeMethod?: string;
  ingredient?: string;
  notificationNumber?: string;
  notification?: string;
  hasOption?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_ORDER_ITEMPk = "id";
export type LP_ORDER_ITEMId = LP_ORDER_ITEM[LP_ORDER_ITEMPk];
export type LP_ORDER_ITEMOptionalAttributes = "id" | "orderId" | "buyingPeriod" | "discountPercentage" | "hasDiscountSchedule" | "discountTimeFrom" | "discountTimeTo" | "price" | "priceSubscription" | "cost" | "productTag" | "capacity" | "expirationUseDate" | "storageMethod" | "intakeMethod" | "ingredient" | "notificationNumber" | "notification" | "hasOption" | "status" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_ORDER_ITEMCreationAttributes = Optional<LP_ORDER_ITEMAttributes, LP_ORDER_ITEMOptionalAttributes>;

export class LP_ORDER_ITEM extends Model<LP_ORDER_ITEMAttributes, LP_ORDER_ITEMCreationAttributes> implements LP_ORDER_ITEMAttributes {
  id!: string;
  orderId?: string;
  buyingPeriod?: string;
  isDiscount!: number;
  discountPercentage?: number;
  hasDiscountSchedule?: number;
  discountTimeFrom?: Date;
  discountTimeTo?: Date;
  productName!: string;
  productImage!: string;
  productDescription!: string;
  price?: number;
  priceSubscription?: number;
  cost?: number;
  productTag?: string;
  quantity!: number;
  capacity?: string;
  expirationUseDate?: Date;
  storageMethod?: string;
  intakeMethod?: string;
  ingredient?: string;
  notificationNumber?: string;
  notification?: string;
  hasOption?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_ORDER_ITEM belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_ORDER_ITEM {
    return LP_ORDER_ITEM.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_ORDER',
        key: 'id'
      },
      field: 'order_id'
    },
    buyingPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'buying_period'
    },
    isDiscount: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_discount'
    },
    discountPercentage: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      field: 'discount_percentage'
    },
    hasDiscountSchedule: {
      type: DataTypes.TINYINT,
      allowNull: true,
      field: 'has_discount_schedule'
    },
    discountTimeFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'discount_time_from'
    },
    discountTimeTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'discount_time_to'
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
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    priceSubscription: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'price_subscription'
    },
    cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    productTag: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_tag'
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    capacity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    expirationUseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiration_use_date'
    },
    storageMethod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'storage_method'
    },
    intakeMethod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'intake_method'
    },
    ingredient: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notificationNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'notification_number'
    },
    notification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasOption: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'has_option'
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
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
