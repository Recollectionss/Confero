import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Poll extends Model {
  public pollId!: string;
  public question!: string;
  public meetingId!: string;
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Poll.init(
  {
    pollId: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
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
