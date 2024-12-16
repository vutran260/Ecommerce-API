import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_BUYER, LP_BUYERId } from './LP_BUYER';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_POINT_HISTORY_LOGSAttributes {
  id: number;
  buyerId: string;
  storeId: string;
  orderId?: number;
  pointAction?: string;
  pointBefore?: number;
  pointAfter?: number;
  pointCount?: number;
  requestPoint?: number;
  requestPointType?: string;
  requestStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_POINT_HISTORY_LOGSPk = 'id';
export type LP_POINT_HISTORY_LOGSId =
  LP_POINT_HISTORY_LOGS[LP_POINT_HISTORY_LOGSPk];
export type LP_POINT_HISTORY_LOGSOptionalAttributes =
  | 'id'
  | 'orderId'
  | 'pointAction'
  | 'pointBefore'
  | 'pointAfter'
  | 'pointCount'
  | 'requestPoint'
  | 'requestPointType'
  | 'requestStatus'
  | 'createdAt'
  | 'updatedAt';
export type LP_POINT_HISTORY_LOGSCreationAttributes = Optional<
  LP_POINT_HISTORY_LOGSAttributes,
  LP_POINT_HISTORY_LOGSOptionalAttributes
>;

export class LP_POINT_HISTORY_LOGS
  extends Model<
    LP_POINT_HISTORY_LOGSAttributes,
    LP_POINT_HISTORY_LOGSCreationAttributes
  >
  implements LP_POINT_HISTORY_LOGSAttributes
{
  id!: number;
  buyerId!: string;
  storeId!: string;
  orderId?: number;
  pointAction?: string;
  pointBefore?: number;
  pointAfter?: number;
  pointCount?: number;
  requestPoint?: number;
  requestPointType?: string;
  requestStatus?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_POINT_HISTORY_LOGS belongsTo LP_BUYER via buyerId
  buyer!: LP_BUYER;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<LP_BUYER>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<LP_BUYER, LP_BUYERId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<LP_BUYER>;
  // LP_POINT_HISTORY_LOGS belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;
  // LP_POINT_HISTORY_LOGS belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof LP_POINT_HISTORY_LOGS {
    return LP_POINT_HISTORY_LOGS.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        buyerId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'LP_BUYER',
            key: 'id',
          },
          field: 'buyer_id',
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
        orderId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'LP_ORDER',
            key: 'id',
          },
          field: 'order_id',
        },
        pointAction: {
          type: DataTypes.STRING(500),
          allowNull: true,
          field: 'point_action',
        },
        pointBefore: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'point_before',
        },
        pointAfter: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'point_after',
        },
        pointCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'point_count',
        },
        requestPoint: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'request_point',
        },
        requestPointType: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'request_point_type',
        },
        requestStatus: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'request_status',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_POINT_HISTORY_LOGS',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'buyer_id',
            using: 'BTREE',
            fields: [{ name: 'buyer_id' }],
          },
          {
            name: 'store_id',
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
          {
            name: 'order_id',
            using: 'BTREE',
            fields: [{ name: 'order_id' }],
          },
        ],
      },
    );
  }
}
