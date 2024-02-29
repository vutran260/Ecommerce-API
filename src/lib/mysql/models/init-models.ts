import type { Sequelize } from "sequelize";
import { LP_ADMIN as _LP_ADMIN } from "./LP_ADMIN";
import type { LP_ADMINAttributes, LP_ADMINCreationAttributes } from "./LP_ADMIN";
import { LP_BUYER as _LP_BUYER } from "./LP_BUYER";
import type { LP_BUYERAttributes, LP_BUYERCreationAttributes } from "./LP_BUYER";
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
  const LP_PRODUCT = _LP_PRODUCT.initModel(sequelize);
  const LP_SELLER = _LP_SELLER.initModel(sequelize);
  const LP_STORE = _LP_STORE.initModel(sequelize);
  const LP_USER = _LP_USER.initModel(sequelize);

  LP_SELLER.belongsTo(LP_STORE, { as: "store", foreignKey: "store_id"});
  LP_STORE.hasMany(LP_SELLER, { as: "LP_SELLERs", foreignKey: "store_id"});
  LP_BUYER.belongsTo(LP_USER, { as: "id_LP_USER", foreignKey: "id"});
  LP_USER.hasOne(LP_BUYER, { as: "LP_BUYER", foreignKey: "id"});
  LP_SELLER.belongsTo(LP_USER, { as: "id_LP_USER", foreignKey: "id"});
  LP_USER.hasOne(LP_SELLER, { as: "LP_SELLER", foreignKey: "id"});

  return {
    LP_ADMIN: LP_ADMIN,
    LP_BUYER: LP_BUYER,
    LP_PRODUCT: LP_PRODUCT,
    LP_SELLER: LP_SELLER,
    LP_STORE: LP_STORE,
    LP_USER: LP_USER,
  };
}
