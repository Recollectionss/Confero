import { Model } from 'sequelize';

import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Meeting extends Model {
  public meetingId!: string;
  public date!: number;
  public isActive!: boolean;
  public minTargetVotes!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Meeting.init(
  {
    meetingId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataType.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    isActive: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    minTargetVotes: {
      type: DataType.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meeting',
    timestamps: true,
  },
);
