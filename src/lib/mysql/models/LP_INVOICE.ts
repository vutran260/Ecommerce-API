import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_ORDER, LP_ORDERId } from './LP_ORDER';

export interface LP_INVOICEAttributes {
  id: number;
  orderId: number;
  invoiceDate: Date;
  totalAmount: number;
  taxAmount?: number;
  issuedBy?: string;
  toEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_INVOICEPk = 'id';
export type LP_INVOICEId = LP_INVOICE[LP_INVOICEPk];
export type LP_INVOICEOptionalAttributes =
  | 'taxAmount'
  | 'issuedBy'
  | 'createdAt'
  | 'updatedAt';
export type LP_INVOICECreationAttributes = Optional<
  LP_INVOICEAttributes,
  LP_INVOICEOptionalAttributes
>;

export class LP_INVOICE
  extends Model<LP_INVOICEAttributes, LP_INVOICECreationAttributes>
  implements LP_INVOICEAttributes
{
  id!: number;
  orderId!: number;
  invoiceDate!: Date;
  totalAmount!: number;
  taxAmount?: number;
  issuedBy?: string;
  toEmail!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_INVOICE belongsTo LP_ORDER via orderId
  order!: LP_ORDER;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<LP_ORDER>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<LP_ORDER, LP_ORDERId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<LP_ORDER>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_INVOICE {
    return LP_INVOICE.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'LP_ORDER',
            key: 'id',
          },
          field: 'order_id',
        },
        invoiceDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'invoice_date',
        },
        totalAmount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          field: 'total_amount',
        },
        taxAmount: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          field: 'tax_amount',
        },
        issuedBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'issued_by',
        },
        toEmail: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'to_email',
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
        tableName: 'LP_INVOICE',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
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
