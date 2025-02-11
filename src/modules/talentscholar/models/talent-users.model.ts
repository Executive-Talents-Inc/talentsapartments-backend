import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, ForeignKey } from 'sequelize-typescript';
import { Country } from './country.model';
import { State } from './state.model';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

export enum UserRoles {
  ADMIN = 'admin',
  DEAN = 'dean',
  HOD = 'hod',
  STAFF = 'staff',
  ADMISSION_OFFICER = 'admission_officer',
  LECTURER = 'lecturer',
  STUDENT = 'student',
  APPLICANT = 'applicant',
  PARENT = 'parent',
  GUARDIAN = 'guardian',
  ALUMNI = 'alumni',
  SUPER_ADMIN = 'super_admin',
}

@Table({ tableName: 'talent_users' })
export class TalentUser extends Model<TalentUser> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column({ allowNull: false })
  user_name: string;

  @Column({ type: DataType.TEXT })
  first_name: string;

  @Column({ type: DataType.TEXT })
  last_name: string;

  @Column({ type: DataType.TEXT })
  middle_name: string;

  @Column({ type: DataType.TEXT })
  other_names: string;

  @Unique
  @Column({ allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  phone_number: string;

  @Column({ allowNull: false })
  password: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_super_user: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_verified: boolean;

  @Column({ type: DataType.TEXT })
  profile_picture: string;

  @Column({ type: DataType.DATE })
  date_of_birth: Date;

  @ForeignKey(() => Country)
  @Column({ allowNull: false })
  country_id: number;

  @ForeignKey(() => State)
  @Column({ allowNull: false })
  state_id: number;

  @Column({ type: DataType.TEXT })
  city: string;

  @Column({ type: DataType.TEXT })
  address_line_1: string;

  @Column({ type: DataType.TEXT })
  address_line_2: string;

  @Column({ type: DataType.STRING(20) })
  postal_code: string;

  @Column({ type: DataType.TEXT })
  profile_link: string;

  @Column({ type: DataType.TEXT })
  bio: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  two_factor_enabled: boolean;

  @Column({ type: DataType.JSON })
  preferences: object;

  @Default(UserStatus.ACTIVE)
  @Column({ type: DataType.ENUM(...Object.values(UserStatus)) })
  status: UserStatus;

  @Default(UserRoles.APPLICANT)
  @Column({ type: DataType.ENUM(...Object.values(UserRoles)) })
  role: UserRoles;

  @Column({ type: DataType.DATE })
  last_login: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  subscription_expires_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  subscribed_at: Date;

  @Column({ type: DataType.DATE })
  deleted_at: Date;
}