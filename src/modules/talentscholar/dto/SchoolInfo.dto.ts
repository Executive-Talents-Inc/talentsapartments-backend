import { IsString, IsOptional, IsEmail } from 'class-validator';

export class SchoolInfoDto {
  @IsOptional()
  school_id?: number;

  @IsString()
  school_name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  logo_url: string;

  @IsString()
  description: string;

      @IsString()
      createdBy: string;
}