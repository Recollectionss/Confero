import { Model } from 'sequelize';
import { Column, DataType } from 'sequelize-typescript';

interface VoiceCreateAttribute {
  value: number;
  userId: number;
  poolId: number;
}

export class Voice extends Model<Voice, VoiceCreateAttribute> {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  voiceId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  value!: number;

  @Column({ type: DataType.UUID, allowNull: false })
  userId!: number;

  @Column({ type: DataType.UUID, allowNull: false })
  poolId!: number;
}
