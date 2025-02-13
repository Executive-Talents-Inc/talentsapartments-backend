import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus, UserType } from '../models/iam.model';


export class CreateSuperAdminDto {
 
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  middle_name: string;

  @IsString()
  other_names: string;
  
  @IsString()
  phone_number: string;

  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserType)
  user_type: UserType = UserType.SUPER_ADMIN;

  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

}
