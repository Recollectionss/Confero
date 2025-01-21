import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Voted extends Model {
  public readonly votedId!: number;
  public votedFor!: string;
  public result!: string;
  public pollId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Voted.init(
  {
    votedId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    votedFor: {
      type: DataType.STRING,
      allowNull: false,
    },
    result: {
      type: DataType.BOOLEAN,
      allowNull: true,
    },
    pollId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Poll',
        key: 'pollId',
      },
    },
  },
  {
    sequelize,
    modelName: 'Voted',
    tableName: 'Voted',
    timestamps: true,
  },
);
