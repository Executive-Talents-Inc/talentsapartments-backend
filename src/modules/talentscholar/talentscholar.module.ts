import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TalentscholarController } from './talentscholar.controller';
import { TalentscholarService } from './talentscholar.service';
import { TalentUser } from './models/talent-users.model';
import { Student } from './models/students.model';
import { Applicant } from './models/applicants.model';
import { SchoolInfo } from './models/school-info.model';
import { User } from '../iam/models/iam.model';
import { Staffs } from './models/staff.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Staffs, TalentUser, Student, Applicant, SchoolInfo]), 
  ],
  controllers: [TalentscholarController],
  providers: [ TalentscholarService],
})
export class TalentscholarModule {}
