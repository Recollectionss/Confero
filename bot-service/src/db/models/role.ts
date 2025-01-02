import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';

export class Role extends Model {
  public roleId!: string;
  public roleName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    roleId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
    },
    roleName: {
      type: DataType.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'Role' },
);
