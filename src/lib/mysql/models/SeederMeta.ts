import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SeederMetaAttributes {
  id: number;
  seederName: string;
  createdAt: Date;
}

export type SeederMetaPk = "id";
export type SeederMetaId = SeederMeta[SeederMetaPk];
export type SeederMetaOptionalAttributes = "id";
export type SeederMetaCreationAttributes = Optional<SeederMetaAttributes, SeederMetaOptionalAttributes>;

export class SeederMeta extends Model<SeederMetaAttributes, SeederMetaCreationAttributes> implements SeederMetaAttributes {
  id!: number;
  seederName!: string;
  createdAt!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof SeederMeta {
    return SeederMeta.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    seederName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "seederName"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'SeederMeta',
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
        name: "seederName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "seederName" },
        ]
      },
    ]
  });
  }
}
