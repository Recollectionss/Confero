import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class MeetingUsers extends Model {
  public meetingId!: number;
  public userId!: number;
}

MeetingUsers.init(
  {
    meetingId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Meeting',
        key: 'meetingId',
      },
    },
    userId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
  },
  { sequelize, modelName: 'MeetingUsers' },
);
