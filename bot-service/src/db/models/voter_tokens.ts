import { Model } from 'sequelize';
import { Column, DataType, Table } from 'sequelize-typescript';

@Table({ tableName: 'voter_tokens' })
export class VoterTokens extends Model<VoterTokens> {
  @Column({ type: DataType.UUID, allowNull: false, primaryKey: true })
  tokenId!: number;

  @Column({ type: DataType.NUMBER, allowNull: false })
  token!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  used!: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  timeLive!: Date;

  @Column({ type: DataType.UUID, allowNull: false })
  userId!: number;
}
