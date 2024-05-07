import type { Sequelize } from "sequelize";
import { LP_ADMIN as _LP_ADMIN } from "./LP_ADMIN";
import type { LP_ADMINAttributes, LP_ADMINCreationAttributes } from "./LP_ADMIN";
import { LP_BUYER as _LP_BUYER } from "./LP_BUYER";
import type { LP_BUYERAttributes, LP_BUYERCreationAttributes } from "./LP_BUYER";
import { LP_CART as _LP_CART } from "./LP_CART";
import type { LP_CARTAttributes, LP_CARTCreationAttributes } from "./LP_CART";
import { LP_CATEGORY as _LP_CATEGORY } from "./LP_CATEGORY";
import type { LP_CATEGORYAttributes, LP_CATEGORYCreationAttributes } from "./LP_CATEGORY";
import { LP_PRODUCT as _LP_PRODUCT } from "./LP_PRODUCT";
import type { LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes } from "./LP_PRODUCT";
import { LP_PRODUCT_CATEGORY as _LP_PRODUCT_CATEGORY } from "./LP_PRODUCT_CATEGORY";
import type { LP_PRODUCT_CATEGORYAttributes, LP_PRODUCT_CATEGORYCreationAttributes } from "./LP_PRODUCT_CATEGORY";
import { LP_PRODUCT_COMPONENT as _LP_PRODUCT_COMPONENT } from "./LP_PRODUCT_COMPONENT";
import type { LP_PRODUCT_COMPONENTAttributes, LP_PRODUCT_COMPONENTCreationAttributes } from "./LP_PRODUCT_COMPONENT";
import { LP_PRODUCT_OPTION as _LP_PRODUCT_OPTION } from "./LP_PRODUCT_OPTION";
import type { LP_PRODUCT_OPTIONAttributes, LP_PRODUCT_OPTIONCreationAttributes } from "./LP_PRODUCT_OPTION";
import { LP_PRODUCT_OPTION_PRICE as _LP_PRODUCT_OPTION_PRICE } from "./LP_PRODUCT_OPTION_PRICE";
import type { LP_PRODUCT_OPTION_PRICEAttributes, LP_PRODUCT_OPTION_PRICECreationAttributes } from "./LP_PRODUCT_OPTION_PRICE";
import { LP_SELLER as _LP_SELLER } from "./LP_SELLER";
import type { LP_SELLERAttributes, LP_SELLERCreationAttributes } from "./LP_SELLER";
import { LP_STORE as _LP_STORE } from "./LP_STORE";
import type { LP_STOREAttributes, LP_STORECreationAttributes } from "./LP_STORE";
import { LP_STORE_BUYER as _LP_STORE_BUYER } from "./LP_STORE_BUYER";
import type { LP_STORE_BUYERAttributes, LP_STORE_BUYERCreationAttributes } from "./LP_STORE_BUYER";

export {
  _LP_ADMIN as LP_ADMIN,
  _LP_BUYER as LP_BUYER,
  _LP_CART as LP_CART,
  _LP_CATEGORY as LP_CATEGORY,
  _LP_PRODUCT as LP_PRODUCT,
  _LP_PRODUCT_CATEGORY as LP_PRODUCT_CATEGORY,
  _LP_PRODUCT_COMPONENT as LP_PRODUCT_COMPONENT,
  _LP_PRODUCT_OPTION as LP_PRODUCT_OPTION,
  _LP_PRODUCT_OPTION_PRICE as LP_PRODUCT_OPTION_PRICE,
  _LP_SELLER as LP_SELLER,
  _LP_STORE as LP_STORE,
  _LP_STORE_BUYER as LP_STORE_BUYER,
};

export type {
  LP_ADMINAttributes,
  LP_ADMINCreationAttributes,
  LP_BUYERAttributes,
  LP_BUYERCreationAttributes,
  LP_CARTAttributes,
  LP_CARTCreationAttributes,
  LP_CATEGORYAttributes,
  LP_CATEGORYCreationAttributes,
  LP_PRODUCTAttributes,
  LP_PRODUCTCreationAttributes,
  LP_PRODUCT_CATEGORYAttributes,
  LP_PRODUCT_CATEGORYCreationAttributes,
  LP_PRODUCT_COMPONENTAttributes,
  LP_PRODUCT_COMPONENTCreationAttributes,
  LP_PRODUCT_OPTIONAttributes,
  LP_PRODUCT_OPTIONCreationAttributes,
  LP_PRODUCT_OPTION_PRICEAttributes,
  LP_PRODUCT_OPTION_PRICECreationAttributes,
  LP_SELLERAttributes,
  LP_SELLERCreationAttributes,
  LP_STOREAttributes,
  LP_STORECreationAttributes,
  LP_STORE_BUYERAttributes,
  LP_STORE_BUYERCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const LP_ADMIN = _LP_ADMIN.initModel(sequelize);
  const LP_BUYER = _LP_BUYER.initModel(sequelize);
  const LP_CART = _LP_CART.initModel(sequelize);
  const LP_CATEGORY = _LP_CATEGORY.initModel(sequelize);
  const LP_PRODUCT = _LP_PRODUCT.initModel(sequelize);
  const LP_PRODUCT_CATEGORY = _LP_PRODUCT_CATEGORY.initModel(sequelize);
  const LP_PRODUCT_COMPONENT = _LP_PRODUCT_COMPONENT.initModel(sequelize);
  const LP_PRODUCT_OPTION = _LP_PRODUCT_OPTION.initModel(sequelize);
  const LP_PRODUCT_OPTION_PRICE = _LP_PRODUCT_OPTION_PRICE.initModel(sequelize);
  const LP_SELLER = _LP_SELLER.initModel(sequelize);
  const LP_STORE = _LP_STORE.initModel(sequelize);
  const LP_STORE_BUYER = _LP_STORE_BUYER.initModel(sequelize);

  LP_BUYER.belongsToMany(LP_STORE, { as: 'storeIdLpStores', through: LP_STORE_BUYER, foreignKey: "buyerId", otherKey: "storeId" });
  LP_CATEGORY.belongsToMany(LP_PRODUCT, { as: 'productIdLpProducts', through: LP_PRODUCT_CATEGORY, foreignKey: "categoryId", otherKey: "productId" });
  LP_PRODUCT.belongsToMany(LP_CATEGORY, { as: 'categoryIdLpCategories', through: LP_PRODUCT_CATEGORY, foreignKey: "productId", otherKey: "categoryId" });
  LP_STORE.belongsToMany(LP_BUYER, { as: 'buyerIdLpBuyers', through: LP_STORE_BUYER, foreignKey: "storeId", otherKey: "buyerId" });
  LP_CART.belongsTo(LP_BUYER, { as: "buyer", foreignKey: "buyerId"});
  LP_BUYER.hasMany(LP_CART, { as: "lpCarts", foreignKey: "buyerId"});
  LP_STORE_BUYER.belongsTo(LP_BUYER, { as: "buyer", foreignKey: "buyerId"});
  LP_BUYER.hasMany(LP_STORE_BUYER, { as: "lpStoreBuyers", foreignKey: "buyerId"});
  LP_PRODUCT_CATEGORY.belongsTo(LP_CATEGORY, { as: "category", foreignKey: "categoryId"});
  LP_CATEGORY.hasMany(LP_PRODUCT_CATEGORY, { as: "lpProductCategories", foreignKey: "categoryId"});
  LP_CART.belongsTo(LP_PRODUCT, { as: "product", foreignKey: "productId"});
  LP_PRODUCT.hasMany(LP_CART, { as: "lpCarts", foreignKey: "productId"});
  LP_PRODUCT_CATEGORY.belongsTo(LP_PRODUCT, { as: "product", foreignKey: "productId"});
  LP_PRODUCT.hasMany(LP_PRODUCT_CATEGORY, { as: "lpProductCategories", foreignKey: "productId"});
  LP_PRODUCT_COMPONENT.belongsTo(LP_PRODUCT, { as: "product", foreignKey: "productId"});
  LP_PRODUCT.hasMany(LP_PRODUCT_COMPONENT, { as: "lpProductComponents", foreignKey: "productId"});
  LP_PRODUCT_OPTION.belongsTo(LP_PRODUCT, { as: "product", foreignKey: "productId"});
  LP_PRODUCT.hasMany(LP_PRODUCT_OPTION, { as: "lpProductOptions", foreignKey: "productId"});
  LP_PRODUCT_OPTION_PRICE.belongsTo(LP_PRODUCT, { as: "product", foreignKey: "productId"});
  LP_PRODUCT.hasMany(LP_PRODUCT_OPTION_PRICE, { as: "lpProductOptionPrices", foreignKey: "productId"});
  LP_CART.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_CART, { as: "lpCarts", foreignKey: "storeId"});
  LP_CATEGORY.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_CATEGORY, { as: "lpCategories", foreignKey: "storeId"});
  LP_PRODUCT.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_PRODUCT, { as: "lpProducts", foreignKey: "storeId"});
  LP_SELLER.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_SELLER, { as: "lpSellers", foreignKey: "storeId"});
  LP_STORE_BUYER.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_STORE_BUYER, { as: "lpStoreBuyers", foreignKey: "storeId"});

  return {
    LP_ADMIN: LP_ADMIN,
    LP_BUYER: LP_BUYER,
    LP_CART: LP_CART,
    LP_CATEGORY: LP_CATEGORY,
    LP_PRODUCT: LP_PRODUCT,
    LP_PRODUCT_CATEGORY: LP_PRODUCT_CATEGORY,
    LP_PRODUCT_COMPONENT: LP_PRODUCT_COMPONENT,
    LP_PRODUCT_OPTION: LP_PRODUCT_OPTION,
    LP_PRODUCT_OPTION_PRICE: LP_PRODUCT_OPTION_PRICE,
    LP_SELLER: LP_SELLER,
    LP_STORE: LP_STORE,
    LP_STORE_BUYER: LP_STORE_BUYER,
  };
}
