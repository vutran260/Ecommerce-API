import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';
import type { LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId } from './LP_STORE_PICKUP_ADDRESS';

export interface LP_STORE_ADDRESSAttributes {
  id: string;
  storeId?: string;
  storeName?: string;
  storeNameKana?: string;
  owner?: string;
  zipCode?: string;
  phone?: string;
  city?: string;
  ward?: string;
  town?: string;
  village?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
}

export type LP_STORE_ADDRESSPk = "id";
export type LP_STORE_ADDRESSId = LP_STORE_ADDRESS[LP_STORE_ADDRESSPk];
export type LP_STORE_ADDRESSOptionalAttributes = "id" | "storeId" | "storeName" | "storeNameKana" | "owner" | "zipCode" | "phone" | "city" | "ward" | "town" | "village" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy" | "deletedAt";
export type LP_STORE_ADDRESSCreationAttributes = Optional<LP_STORE_ADDRESSAttributes, LP_STORE_ADDRESSOptionalAttributes>;

export class LP_STORE_ADDRESS extends Model<LP_STORE_ADDRESSAttributes, LP_STORE_ADDRESSCreationAttributes> implements LP_STORE_ADDRESSAttributes {
  id!: string;
  storeId?: string;
  storeName?: string;
  storeNameKana?: string;
  owner?: string;
  zipCode?: string;
  phone?: string;
  city?: string;
  ward?: string;
  town?: string;
  village?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;

  // LP_STORE_ADDRESS belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;
  // LP_STORE_ADDRESS hasMany LP_STORE_PICKUP_ADDRESS via storeAddressId
  lpStorePickupAddresses!: LP_STORE_PICKUP_ADDRESS[];
  getLpStorePickupAddresses!: Sequelize.HasManyGetAssociationsMixin<LP_STORE_PICKUP_ADDRESS>;
  setLpStorePickupAddresses!: Sequelize.HasManySetAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  addLpStorePickupAddress!: Sequelize.HasManyAddAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  addLpStorePickupAddresses!: Sequelize.HasManyAddAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  createLpStorePickupAddress!: Sequelize.HasManyCreateAssociationMixin<LP_STORE_PICKUP_ADDRESS>;
  removeLpStorePickupAddress!: Sequelize.HasManyRemoveAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  removeLpStorePickupAddresses!: Sequelize.HasManyRemoveAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  hasLpStorePickupAddress!: Sequelize.HasManyHasAssociationMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  hasLpStorePickupAddresses!: Sequelize.HasManyHasAssociationsMixin<LP_STORE_PICKUP_ADDRESS, LP_STORE_PICKUP_ADDRESSId>;
  countLpStorePickupAddresses!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_ADDRESS {
    return LP_STORE_ADDRESS.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'LP_STORE',
        key: 'id'
      },
      field: 'store_id'
    },
    storeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'store_name'
    },
    storeNameKana: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'store_name_kana'
    },
    owner: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'zip_code'
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    town: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    village: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    createdBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'created_by'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    updatedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'updated_by'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    tableName: 'LP_STORE_ADDRESS',
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
        name: "store_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
    ]
  });
  }
}
