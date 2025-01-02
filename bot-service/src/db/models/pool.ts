import { Model } from 'sequelize';
import { Column, DataType } from 'sequelize-typescript';

interface PoolCreateAttribute {
  question: string;
  votedFor: string;
  meetingId: number;
}

export class Pool extends Model<Pool, PoolCreateAttribute> {
  @Column({ type: DataType.UUID, unique: true, allowNull: false, primaryKey: true })
  poolId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  question!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  votedFor!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  meetingId!: number;
}
