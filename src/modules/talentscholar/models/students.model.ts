import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { TalentUser } from './talent-users.model';


@Table({ tableName: 'students' })
export class Student extends Model<Student> {
  @PrimaryKey
  @ForeignKey(() => TalentUser)
  @Column
  user_id: number;

  @Column({ unique: true, allowNull: false })
  matric_number: string;

  @ForeignKey(() => TalentUser)
  @Column
  createdBy: number;
}
