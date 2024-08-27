import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LP_PREFECTURESAttributes {
  id: number;
  prefectureName?: string;
}

export type LP_PREFECTURESPk = 'id';
export type LP_PREFECTURESId = LP_PREFECTURES[LP_PREFECTURESPk];
export type LP_PREFECTURESOptionalAttributes = 'id' | 'prefectureName';
export type LP_PREFECTURESCreationAttributes = Optional<
  LP_PREFECTURESAttributes,
  LP_PREFECTURESOptionalAttributes
>;

export class LP_PREFECTURES
  extends Model<LP_PREFECTURESAttributes, LP_PREFECTURESCreationAttributes>
  implements LP_PREFECTURESAttributes
{
  id!: number;
  prefectureName?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_PREFECTURES {
    return LP_PREFECTURES.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        prefectureName: {
          type: DataTypes.CHAR(225),
          allowNull: true,
          field: 'prefecture_name',
        },
      },
      {
        sequelize,
        tableName: 'LP_PREFECTURES',
        timestamps: false,
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
