import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_PRODUCT, LP_PRODUCTId } from './LP_PRODUCT';

export interface LP_PRODUCT_OPTION_PRICEAttributes {
  productId: string;
  optionValue1: string;
  optionValue2: string;
  optionValue3: string;
  price: number;
  priceBeforeDiscount?: number;
  cost: number;
  stockItem: number;
}

export type LP_PRODUCT_OPTION_PRICEPk = "productId" | "optionValue1" | "optionValue2" | "optionValue3";
export type LP_PRODUCT_OPTION_PRICEId = LP_PRODUCT_OPTION_PRICE[LP_PRODUCT_OPTION_PRICEPk];
export type LP_PRODUCT_OPTION_PRICEOptionalAttributes = "priceBeforeDiscount";
export type LP_PRODUCT_OPTION_PRICECreationAttributes = Optional<LP_PRODUCT_OPTION_PRICEAttributes, LP_PRODUCT_OPTION_PRICEOptionalAttributes>;

export class LP_PRODUCT_OPTION_PRICE extends Model<LP_PRODUCT_OPTION_PRICEAttributes, LP_PRODUCT_OPTION_PRICECreationAttributes> implements LP_PRODUCT_OPTION_PRICEAttributes {
  productId!: string;
  optionValue1!: string;
  optionValue2!: string;
  optionValue3!: string;
  price!: number;
  priceBeforeDiscount?: number;
  cost!: number;
  stockItem!: number;

  // LP_PRODUCT_OPTION_PRICE belongsTo LP_PRODUCT via productId
  product!: LP_PRODUCT;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<LP_PRODUCT>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<LP_PRODUCT, LP_PRODUCTId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<LP_PRODUCT>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PRODUCT_OPTION_PRICE {
    return LP_PRODUCT_OPTION_PRICE.init({
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
    optionValue1: {
      type: DataTypes.STRING(72),
      allowNull: false,
      primaryKey: true,
      field: 'option_value_1'
    },
    optionValue2: {
      type: DataTypes.STRING(72),
      allowNull: false,
      primaryKey: true,
      field: 'option_value_2'
    },
    optionValue3: {
      type: DataTypes.STRING(72),
      allowNull: false,
      primaryKey: true,
      field: 'option_value_3'
    },
    price: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    priceBeforeDiscount: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: true,
      field: 'price_before_discount'
    },
    cost: {
      type: DataTypes.DECIMAL(10,4),
      allowNull: false
    },
    stockItem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'stock_item'
    }
  }, {
    sequelize,
    tableName: 'LP_PRODUCT_OPTION_PRICE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
          { name: "option_value_1" },
          { name: "option_value_2" },
          { name: "option_value_3" },
        ]
      },
    ]
  });
  }
}
