import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Unique,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Country } from './country.model';
import { State } from './state.model';
import { SnowflakeIdGenerator } from '../../../utils/idGenerator';

const snowflakeIdGenerator = new SnowflakeIdGenerator();
export enum UserType {
  SYSTEM_ADMIN = 'system_admin',
  SUPER_ADMIN = 'super_admin',
}

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

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(() => snowflakeIdGenerator.generate())
  @Column({ type: DataType.STRING })
  id: string;

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

  @Column({ type: DataType.ENUM('system_admin', 'super_admin') })
  user_type: UserType;

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
  @Column({ allowNull: true })
  country_id: number;

  @ForeignKey(() => State)
  @Column({ allowNull: true })
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

  @Default(UserRoles.SUPER_ADMIN)
  @Column({ type: DataType.ENUM(...Object.values(UserRoles)) })
  role: UserRoles;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  two_factor_enabled: boolean;

  @Column({ type: DataType.JSON })
  preferences: object;

  @Default(UserStatus.ACTIVE)
  @Column({ type: DataType.ENUM('active', 'inactive', 'expired', 'suspended') })
  status: UserStatus;

  @Column({ type: DataType.DATE })
  last_login: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  subscription_expires_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  subscribed_at: Date;

  @Column({ type: DataType.DATE })
  deleted_at: Date;
}
