import { Controller, Post, Put, Get, Body, Param, UseGuards, Req, ForbiddenException,Request } from '@nestjs/common';
import { TalentscholarService } from './talentscholar.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SchoolInfoDto } from './dto/SchoolInfo.dto';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from './models/talent-users.model';
import { Role } from './guards/role.decorator';


@Controller('talent-users')

export class TalentscholarController {
  constructor(private readonly userService: TalentscholarService) {}


@Post('create-admission-officer')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Role(UserRoles.SUPER_ADMIN)
async createAdmissionOfficer(@Body() dto: CreateUserDto, @Request() req) {
  console.log('User from JWT:', req.user); 
  return this.userService.createAdmissionOfficer(dto, req.user.id);
}


}
