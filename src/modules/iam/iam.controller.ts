import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { IamService } from './iam.service';

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

 
  @Post('create-super-admin')
async createSuperAdmin(@Body() dto: CreateSuperAdminDto) {
  return this.iamService.createSuperAdmin(dto);
}


@Get('verify-super-admin-email')
async verifySuperAdminEmail(
  @Query('token') token?: string,
  @Query('otp') otp?: string,
): Promise<any> {
  return this.iamService.verifySuperAdminEmail(token, otp);
}


  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.iamService.login(email, password);
  }


  @Post('forgot-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this.iamService.requestPasswordReset(email);
  }

  @Post('verify-reset-otp')
  async verifyResetOtp(@Body('token') token: string, @Body('otp') otp: string) {
    return this.iamService.verifyResetPasswordOtp(token, otp);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') resetToken: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.iamService.resetPassword(resetToken, password, confirmPassword);
  }
}
