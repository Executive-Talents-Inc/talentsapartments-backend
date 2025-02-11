import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';;
import { TalentUser } from './talent-users.model';

@Table({ tableName: 'applicants' })
export class Applicant extends Model<Applicant> {
  @PrimaryKey
  @ForeignKey(() => TalentUser)
  @Column
  user_id: number;

  @Column({ allowNull: false })
  application_status: string;

  @ForeignKey(() => TalentUser)
  @Column
  createdBy: number;
}
