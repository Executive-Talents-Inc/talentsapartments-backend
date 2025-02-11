import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType, HasMany } from 'sequelize-typescript';
import { State } from './state.model';


@Table({ tableName: 'countries', timestamps: true })
export class Country extends Model<Country> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(3), allowNull: false })
  iso3: string;

  @Column({ type: DataType.STRING(2), allowNull: false })
  iso2: string;

  @Column({ type: DataType.TEXT })
  logo_url: string;

  @Column({ type: DataType.STRING(10) })
  numeric_code: string;

  @Column({ type: DataType.STRING(10) })
  phone_code: string;

  @Column({ type: DataType.STRING(255) })
  capital: string;

  @Column({ type: DataType.STRING(10) })
  currency: string;

  @Column({ type: DataType.STRING(255) })
  currency_name: string;

  @Column({ type: DataType.STRING(10) })
  currency_symbol: string;

  @Column({ type: DataType.STRING(10) })
  tld: string;

  @Column({ type: DataType.STRING(255) })
  native: string;

  @Column({ type: DataType.STRING(255) })
  region: string;

  @Column({ type: DataType.INTEGER })
  region_id: number;

  @Column({ type: DataType.STRING(255) })
  subregion: string;

  @Column({ type: DataType.INTEGER })
  subregion_id: number;

  @Column({ type: DataType.STRING(255) })
  nationality: string;

  @Column({ type: DataType.STRING(20) })
  latitude: string;

  @Column({ type: DataType.STRING(20) })
  longitude: string;

  @Column({ type: DataType.STRING(10) })
  emoji: string;

  @Column({ type: DataType.STRING(10) })
  emojiU: string;

  @HasMany(() => State)
  states: State[];
}
