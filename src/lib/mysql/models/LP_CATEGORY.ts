import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_CATEGORYAttributes {
  id: string;
  parent_id: string | null;
  category_name?: string;
  category_tag?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type LP_CATEGORYPk = 'id';
export type LP_CATEGORYId = LP_CATEGORY[LP_CATEGORYPk];
export type LP_CATEGORYOptionalAttributes = "parent_id" | "category_name" | "category_tag" | "status" | "created_at" | "updated_at" | "deleted_at";
export type LP_CATEGORYCreationAttributes = Optional<
  LP_CATEGORYAttributes,
  LP_CATEGORYOptionalAttributes
>;

export class LP_CATEGORY
  extends Model<LP_CATEGORYAttributes, LP_CATEGORYCreationAttributes>
  implements LP_CATEGORYAttributes
{
  id!: string;
  parent_id: string;
  category_name?: string;
  category_tag?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_CATEGORY {
    return LP_CATEGORY.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        parent_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        category_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        category_tag: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'LP_CATEGORY',
        timestamps: false,
        paranoid: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
