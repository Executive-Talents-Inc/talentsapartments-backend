import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { TalentUser } from './talent-users.model';

@Table({ tableName: 'school_info', timestamps: true })
export class SchoolInfo extends Model<SchoolInfo> {
  @Column({ primaryKey: true, autoIncrement: true })
  school_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  school_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  logo_url: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @ForeignKey(() => TalentUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  createdBy: number; 
}
