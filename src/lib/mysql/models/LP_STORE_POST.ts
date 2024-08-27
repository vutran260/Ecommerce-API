import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_STORE_POSTAttributes {
  id: string;
  storeId: string;
  postImage: string;
  title: string;
  details: string;
  status?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export type LP_STORE_POSTPk = 'id';
export type LP_STORE_POSTId = LP_STORE_POST[LP_STORE_POSTPk];
export type LP_STORE_POSTOptionalAttributes =
  | 'id'
  | 'status'
  | 'createdAt'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy';
export type LP_STORE_POSTCreationAttributes = Optional<
  LP_STORE_POSTAttributes,
  LP_STORE_POSTOptionalAttributes
>;

export class LP_STORE_POST
  extends Model<LP_STORE_POSTAttributes, LP_STORE_POSTCreationAttributes>
  implements LP_STORE_POSTAttributes
{
  id!: string;
  storeId!: string;
  postImage!: string;
  title!: string;
  details!: string;
  status?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  // LP_STORE_POST belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_POST {
    return LP_STORE_POST.init(
      {
        id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
        postImage: {
          type: DataTypes.STRING(2000),
          allowNull: false,
          field: 'post_image',
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        details: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        createdBy: {
          type: DataTypes.STRING(225),
          allowNull: true,
          field: 'created_by',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
        updatedBy: {
          type: DataTypes.STRING(225),
          allowNull: true,
          field: 'updated_by',
        },
      },
      {
        sequelize,
        tableName: 'LP_STORE_POST',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'store_id',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
