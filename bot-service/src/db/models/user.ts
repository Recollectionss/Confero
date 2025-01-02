import { Model } from 'sequelize';
import { DataType } from 'sequelize-typescript';
import { sequelize } from '../db_connect';

export class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public discordId!: number;
  public roleId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    discordId: {
      type: DataType.BIGINT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    roleId: {
      type: DataType.UUID,
      allowNull: true,
      references: {
        model: 'Role',
        key: 'role_id',
      },
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  },
);
