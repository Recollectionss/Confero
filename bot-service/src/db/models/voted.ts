import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Voted extends Model {
  public readonly votedId!: number;
  public votedFor!: string;
  public pollId!: string;
}

Voted.init(
  {
    votedId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
    },
    votedFor: {
      type: DataType.STRING,
      allowNull: false,
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
  },
);
