import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_SELLER, LP_SELLERId } from './LP_SELLER';

export interface LP_STOREAttributes {
  id: string;
  contact_id: string;
  store_key?: string;
  store_name?: string;
  status?: string;
  remark?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type LP_STOREPk = "id";
export type LP_STOREId = LP_STORE[LP_STOREPk];
export type LP_STOREOptionalAttributes = "id" | "store_key" | "store_name" | "status" | "remark" | "created_at" | "updated_at" | "deleted_at";
export type LP_STORECreationAttributes = Optional<LP_STOREAttributes, LP_STOREOptionalAttributes>;

export class LP_STORE extends Model<LP_STOREAttributes, LP_STORECreationAttributes> implements LP_STOREAttributes {
  id!: string;
  contact_id!: string;
  store_key?: string;
  store_name?: string;
  status?: string;
  remark?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // LP_STORE hasMany LP_SELLER via store_id
  LP_SELLERs!: LP_SELLER[];
  getLP_SELLERs!: Sequelize.HasManyGetAssociationsMixin<LP_SELLER>;
  setLP_SELLERs!: Sequelize.HasManySetAssociationsMixin<LP_SELLER, LP_SELLERId>;
  addLP_SELLER!: Sequelize.HasManyAddAssociationMixin<LP_SELLER, LP_SELLERId>;
  addLP_SELLERs!: Sequelize.HasManyAddAssociationsMixin<LP_SELLER, LP_SELLERId>;
  createLP_SELLER!: Sequelize.HasManyCreateAssociationMixin<LP_SELLER>;
  removeLP_SELLER!: Sequelize.HasManyRemoveAssociationMixin<LP_SELLER, LP_SELLERId>;
  removeLP_SELLERs!: Sequelize.HasManyRemoveAssociationsMixin<LP_SELLER, LP_SELLERId>;
  hasLP_SELLER!: Sequelize.HasManyHasAssociationMixin<LP_SELLER, LP_SELLERId>;
  hasLP_SELLERs!: Sequelize.HasManyHasAssociationsMixin<LP_SELLER, LP_SELLERId>;
  countLP_SELLERs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE {
    return LP_STORE.init({
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('uuid'),
      primaryKey: true
    },
    contact_id: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    store_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "store_key"
    },
    store_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LP_STORE',
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
        name: "store_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "store_key" },
        ]
      },
    ]
  });
  }
}
