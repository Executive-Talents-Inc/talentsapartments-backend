import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Country } from './country.model';

@Table({ tableName: 'states', timestamps: true })
export class State extends Model<State> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Country)
  @Column({ allowNull: false })
  country_id: number;

  @BelongsTo(() => Country)
  country: Country;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(10) })
  state_code: string;

  @Column({ type: DataType.STRING(10) })
  postal_code: string;

  @Column({ type: DataType.STRING(20) })
  latitude: string;

  @Column({ type: DataType.STRING(20) })
  longitude: string;
}
