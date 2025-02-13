import { Injectable, NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TalentUser, UserRoles } from './models/talent-users.model';
import { SchoolInfo } from './models/school-info.model';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../iam/models/iam.model';
import { Staffs } from './models/staff.model';

import { SnowflakeIdGenerator } from 'src/utils/idGenerator';

const snowflakeIdGenerator = new SnowflakeIdGenerator();

@Injectable()
export class TalentscholarService {
  constructor(
    @InjectModel(SchoolInfo) private schoolModel: typeof SchoolInfo,
    @InjectModel(User) private readonly userModel: typeof User, 
    @InjectModel(Staffs) private staffModel: typeof Staffs,
    // @InjectModel(Student) private studentModel: typeof Student,
    // @InjectModel(Applicant) private applicantModel: typeof Applicant,
  ) {}

  async createSchoolInfo(schoolDto) {
    return await this.schoolModel.create({ ...schoolDto });
  }

  async editSchoolInfo(school_id: number, schoolDto) {
    const school = await this.schoolModel.findByPk(school_id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    await school.update(schoolDto);
    return school;
  }

  async getSchoolInfo(school_id: number) {
    const school = await this.schoolModel.findByPk(school_id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }
  
  async createAdmissionOfficer(dto: CreateUserDto, createdById: string): Promise<Staffs> {
    const creator = await this.userModel.findByPk(createdById);

    if (!creator) {
        throw new UnauthorizedException('Creator not found in DB.');
    }

    if (creator.role !== UserRoles.SUPER_ADMIN) {
        throw new UnauthorizedException('Only Super Admins can create Admission Officers.');
    }

    const existingUser = await this.staffModel.findOne({ where: { email: dto.email } });
    if (existingUser) {
        throw new ConflictException('An Admission Officer with this email already exists.');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const prefix = 'AD'; 
    const uniqueNumber = Math.floor(10000000 + Math.random() * 90000000); 
    const staffId = `${prefix}${uniqueNumber}`;
    try {
      return await this.staffModel.create({
          id: snowflakeIdGenerator.generate(),
          ...dto,
          staff_id: staffId,
          email: dto.email,
          password: hashedPassword,
          role: UserRoles.ADMISSION_OFFICER,
          createdBy: createdById,
      });
  } catch (error) {
      throw new InternalServerErrorException(error,'Failed to create Admission Officer.');
  }
  
}


}

