import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Poll extends Model {
  public pollId!: number;
  public question!: string;
  public meetingId!: string;
}

Poll.init(
  {
    pollId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
    },
    question: {
      type: DataType.STRING,
      allowNull: false,
    },
    meetingId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Meeting',
        key: 'meetingId',
      },
    },
  },
  {
    sequelize,
    modelName: 'Poll',
    tableName: 'Poll',
    timestamps: true,
  },
);
