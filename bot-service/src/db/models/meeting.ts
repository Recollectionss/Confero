import { Model } from 'sequelize';

import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Meeting extends Model {
  public meetingId!: number;
  public date!: number;
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
  },
  {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meeting',
    timestamps: true,
  },
);
