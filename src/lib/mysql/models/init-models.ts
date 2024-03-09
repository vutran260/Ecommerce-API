import type { Sequelize } from "sequelize";
import { LP_ADMIN as _LP_ADMIN } from "./LP_ADMIN";
import type { LP_ADMINAttributes, LP_ADMINCreationAttributes } from "./LP_ADMIN";
import { LP_BUYER as _LP_BUYER } from "./LP_BUYER";
import type { LP_BUYERAttributes, LP_BUYERCreationAttributes } from "./LP_BUYER";
import { LP_CATEGORY as _LP_CATEGORY } from "./LP_CATEGORY";
import type { LP_CATEGORYAttributes, LP_CATEGORYCreationAttributes } from "./LP_CATEGORY";
import { LP_PRODUCT as _LP_PRODUCT } from "./LP_PRODUCT";
import type { LP_PRODUCTAttributes, LP_PRODUCTCreationAttributes } from "./LP_PRODUCT";
import { LP_SELLER as _LP_SELLER } from "./LP_SELLER";
import type { LP_SELLERAttributes, LP_SELLERCreationAttributes } from "./LP_SELLER";
import { LP_STORE as _LP_STORE } from "./LP_STORE";
import type { LP_STOREAttributes, LP_STORECreationAttributes } from "./LP_STORE";
import { LP_USER as _LP_USER } from "./LP_USER";
import type { LP_USERAttributes, LP_USERCreationAttributes } from "./LP_USER";

export {
  _LP_ADMIN as LP_ADMIN,
  _LP_BUYER as LP_BUYER,
  _LP_CATEGORY as LP_CATEGORY,
  _LP_PRODUCT as LP_PRODUCT,
  _LP_SELLER as LP_SELLER,
  _LP_STORE as LP_STORE,
  _LP_USER as LP_USER,
};

export type {
  LP_ADMINAttributes,
  LP_ADMINCreationAttributes,
  LP_BUYERAttributes,
  LP_BUYERCreationAttributes,
  LP_CATEGORYAttributes,
  LP_CATEGORYCreationAttributes,
  LP_PRODUCTAttributes,
  LP_PRODUCTCreationAttributes,
  LP_SELLERAttributes,
  LP_SELLERCreationAttributes,
  LP_STOREAttributes,
  LP_STORECreationAttributes,
  LP_USERAttributes,
  LP_USERCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const LP_ADMIN = _LP_ADMIN.initModel(sequelize);
  const LP_BUYER = _LP_BUYER.initModel(sequelize);
  const LP_CATEGORY = _LP_CATEGORY.initModel(sequelize);
  const LP_PRODUCT = _LP_PRODUCT.initModel(sequelize);
  const LP_SELLER = _LP_SELLER.initModel(sequelize);
  const LP_STORE = _LP_STORE.initModel(sequelize);
  const LP_USER = _LP_USER.initModel(sequelize);

  LP_STORE.belongsToMany(LP_USER, { as: 'idLpUsers', through: LP_BUYER, foreignKey: "storeId", otherKey: "id" });
  LP_USER.belongsToMany(LP_STORE, { as: 'storeIdLpStores', through: LP_BUYER, foreignKey: "id", otherKey: "storeId" });
  LP_BUYER.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_BUYER, { as: "lpBuyers", foreignKey: "storeId"});
  LP_CATEGORY.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_CATEGORY, { as: "lpCategories", foreignKey: "storeId"});
  LP_PRODUCT.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_PRODUCT, { as: "lpProducts", foreignKey: "storeId"});
  LP_SELLER.belongsTo(LP_STORE, { as: "store", foreignKey: "storeId"});
  LP_STORE.hasMany(LP_SELLER, { as: "lpSellers", foreignKey: "storeId"});
  LP_BUYER.belongsTo(LP_USER, { as: "idLpUser", foreignKey: "id"});
  LP_USER.hasMany(LP_BUYER, { as: "lpBuyers", foreignKey: "id"});
  LP_SELLER.belongsTo(LP_USER, { as: "idLpUser", foreignKey: "id"});
  LP_USER.hasOne(LP_SELLER, { as: "lpSeller", foreignKey: "id"});

  return {
    LP_ADMIN: LP_ADMIN,
    LP_BUYER: LP_BUYER,
    LP_CATEGORY: LP_CATEGORY,
    LP_PRODUCT: LP_PRODUCT,
    LP_SELLER: LP_SELLER,
    LP_STORE: LP_STORE,
    LP_USER: LP_USER,
  };
}
