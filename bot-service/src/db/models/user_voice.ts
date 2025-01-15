import { Model } from 'sequelize';
import { sequelize } from '../db_connect';
import { DataType } from 'sequelize-typescript';
import { User } from './user';

export class UserVoice extends Model {
  public readonly voiceId!: string;
  public voice!: 'За' | 'Проти' | 'Утримався' | 'Не голосував/ла';

  public voteId!: string;
  public userId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public User?: User;
}

UserVoice.init(
  {
    voiceId: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    },
    voice: {
      type: DataType.ENUM('За', 'Проти', 'Утримався', 'Не голосував/ла'),
      allowNull: false,
    },
    votedId: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: 'Voted',
        key: 'votedId',
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
  },
  {
    sequelize,
    modelName: 'UserVoice',
    tableName: 'UserVoice',
    timestamps: true,
  },
);
