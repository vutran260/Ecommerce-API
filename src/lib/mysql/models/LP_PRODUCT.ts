import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_CATEGORY, LP_CATEGORYId } from './LP_CATEGORY';
import type { LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId } from './LP_PRODUCT_CATEGORY';
import type { LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId } from './LP_PRODUCT_COMPONENT';
import type { LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId } from './LP_PRODUCT_OPTION';
import type { LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId } from './LP_PRODUCT_OPTION_PRICE';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_PRODUCTAttributes {
  id: string;
  storeId: string;
  isSubscription: number;
  buyingTimeOption?: string;
  buyingPeriod?: string;
  isRecomend: number;
  productName: string;
  productImage: string;
  productDescription: string;
  capacity?: string;
  expirationUseDate?: string;
  storageMethod?: string;
  intakeMethod?: string;
  ingredient?: string;
  notificationNumber?: string;
  notification?: string;
  hasOption: number;
  price?: number;
  priceBeforeDiscount?: number;
  cost?: number;
  stockItem?: number;
  productTag?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type LP_PRODUCTPk = "id";
export type LP_PRODUCTId = LP_PRODUCT[LP_PRODUCTPk];
export type LP_PRODUCTOptionalAttributes = "id" | "buyingTimeOption" | "buyingPeriod" | "capacity" | "expirationUseDate" | "storageMethod" | "intakeMethod" | "ingredient" | "notificationNumber" | "notification" | "price" | "priceBeforeDiscount" | "cost" | "stockItem" | "productTag" | "status" | "createdAt" | "updatedAt" | "deletedAt";
export type LP_PRODUCTCreationAttributes = Optional<LP_PRODUCTAttributes, LP_PRODUCTOptionalAttributes>;

export class LP_PRODUCT extends Model<LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes> implements LP_PRODUCTAttributes {
  id!: string;
  storeId!: string;
  isSubscription!: number;
  buyingTimeOption?: string;
  buyingPeriod?: string;
  isRecomend!: number;
  productName!: string;
  productImage!: string;
  productDescription!: string;
  capacity?: string;
  expirationUseDate?: string;
  storageMethod?: string;
  intakeMethod?: string;
  ingredient?: string;
  notificationNumber?: string;
  notification?: string;
  hasOption!: number;
  price?: number;
  priceBeforeDiscount?: number;
  cost?: number;
  stockItem?: number;
  productTag?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // LP_PRODUCT belongsToMany LP_CATEGORY via productId and categoryId
  categoryIdLpCategories!: LP_CATEGORY[];
  getCategoryIdLpCategories!: Sequelize.BelongsToManyGetAssociationsMixin<LP_CATEGORY>;
  setCategoryIdLpCategories!: Sequelize.BelongsToManySetAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  addCategoryIdLpCategory!: Sequelize.BelongsToManyAddAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  addCategoryIdLpCategories!: Sequelize.BelongsToManyAddAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  createCategoryIdLpCategory!: Sequelize.BelongsToManyCreateAssociationMixin<LP_CATEGORY>;
  removeCategoryIdLpCategory!: Sequelize.BelongsToManyRemoveAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  removeCategoryIdLpCategories!: Sequelize.BelongsToManyRemoveAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasCategoryIdLpCategory!: Sequelize.BelongsToManyHasAssociationMixin<LP_CATEGORY, LP_CATEGORYId>;
  hasCategoryIdLpCategories!: Sequelize.BelongsToManyHasAssociationsMixin<LP_CATEGORY, LP_CATEGORYId>;
  countCategoryIdLpCategories!: Sequelize.BelongsToManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_CATEGORY via productId
  lpProductCategories!: LP_PRODUCT_CATEGORY[];
  getLpProductCategories!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_CATEGORY>;
  setLpProductCategories!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  addLpProductCategory!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  addLpProductCategories!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  createLpProductCategory!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_CATEGORY>;
  removeLpProductCategory!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  removeLpProductCategories!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  hasLpProductCategory!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  hasLpProductCategories!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_CATEGORY, LP_PRODUCT_CATEGORYId>;
  countLpProductCategories!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_COMPONENT via productId
  lpProductComponents!: LP_PRODUCT_COMPONENT[];
  getLpProductComponents!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_COMPONENT>;
  setLpProductComponents!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  addLpProductComponent!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  addLpProductComponents!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  createLpProductComponent!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_COMPONENT>;
  removeLpProductComponent!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  removeLpProductComponents!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  hasLpProductComponent!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  hasLpProductComponents!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_COMPONENT, LP_PRODUCT_COMPONENTId>;
  countLpProductComponents!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_OPTION via productId
  lpProductOptions!: LP_PRODUCT_OPTION[];
  getLpProductOptions!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_OPTION>;
  setLpProductOptions!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  addLpProductOption!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  addLpProductOptions!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  createLpProductOption!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_OPTION>;
  removeLpProductOption!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  removeLpProductOptions!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  hasLpProductOption!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  hasLpProductOptions!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_OPTION, LP_PRODUCT_OPTIONId>;
  countLpProductOptions!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT hasMany LP_PRODUCT_OPTION_PRICE via productId
  lpProductOptionPrices!: LP_PRODUCT_OPTION_PRICE[];
  getLpProductOptionPrices!: Sequelize.HasManyGetAssociationsMixin<LP_PRODUCT_OPTION_PRICE>;
  setLpProductOptionPrices!: Sequelize.HasManySetAssociationsMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  addLpProductOptionPrice!: Sequelize.HasManyAddAssociationMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  addLpProductOptionPrices!: Sequelize.HasManyAddAssociationsMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  createLpProductOptionPrice!: Sequelize.HasManyCreateAssociationMixin<LP_PRODUCT_OPTION_PRICE>;
  removeLpProductOptionPrice!: Sequelize.HasManyRemoveAssociationMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  removeLpProductOptionPrices!: Sequelize.HasManyRemoveAssociationsMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  hasLpProductOptionPrice!: Sequelize.HasManyHasAssociationMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  hasLpProductOptionPrices!: Sequelize.HasManyHasAssociationsMixin<LP_PRODUCT_OPTION_PRICE, LP_PRODUCT_OPTION_PRICEId>;
  countLpProductOptionPrices!: Sequelize.HasManyCountAssociationsMixin;
  // LP_PRODUCT belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT {
    return LP_PRODUCT.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    isSubscription: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_subscription'
    },
    buyingTimeOption: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'buying_time_option'
    },
    buyingPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'buying_period'
    },
    isRecomend: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'is_recomend'
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'product_name'
    },
    productImage: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: 'product_image'
    },
    productDescription: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: 'product_description'
    },
    capacity: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expirationUseDate: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notificationNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'notification_number'
    },
    notification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hasOption: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'has_option'
    },
    price: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: true
    },
    priceBeforeDiscount: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: true,
      field: 'price_before_discount'
    },
    cost: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: true
    },
    stockItem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'stock_item'
    },
    productTag: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'product_tag'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT',
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
        name: "fk_store_id_product",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
