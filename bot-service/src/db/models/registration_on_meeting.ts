import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';
import { User } from './user';

export class RegistrationOnMeeting extends Model {
  public token!: string;
  public meetingId!: string;
  public userId!: string;
  public userVerified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public User?: User;
}

RegistrationOnMeeting.init(
  {
    token: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    meetingId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Meeting',
        key: 'meetingId',
      },
    },
    userId: {
      type: DataType.STRING,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userId',
      },
    },
    userVerified: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'RegistrationOnMeeting',
    tableName: 'RegistrationOnMeeting',
    timestamps: true,
  },
);
