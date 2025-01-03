import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export interface RegistrationTokenAttributes {
  token: string;
  userId: string;
}

export class RegistrationToken extends Model {
  public readonly tokenId!: string;
  public token!: string;
  public userId!: string;
}

RegistrationToken.init(
  {
    token: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
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
  {
    sequelize,
    modelName: 'RegistrationToken',
    tableName: 'RegistrationToken',
    timestamps: true,
  },
);
