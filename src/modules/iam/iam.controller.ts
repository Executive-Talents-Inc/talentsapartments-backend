import { Body, Controller, Post } from '@nestjs/common';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { IamService } from './iam.service';
import { User } from './models/iam.model';
import { LoginDto } from './dto/login.dto';


@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('create-super-admin')
  async createSuperAdmin(@Body() dto: CreateSuperAdminDto): Promise<User> {
    return this.iamService.createSuperAdmin(dto);
  }

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.iamService.login(email, password);
  }
}
