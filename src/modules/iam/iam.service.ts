import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserType } from './models/iam.model';
import { Staffs } from '../talentscholar/models/staff.model';
import { SnowflakeIdGenerator } from '../../utils/idGenerator';
import { ConfigService } from '@nestjs/config';

const snowflakeIdGenerator = new SnowflakeIdGenerator();

@Injectable()
export class IamService {
  private readonly logger = new Logger(IamService.name);
  private verifiedUsers = new Map<string, boolean>();

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Staffs) private readonly staffModel: typeof Staffs,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createSuperAdmin(
    dto: CreateSuperAdminDto,
  ): Promise<{ message: string; token: string; otp: string }> {
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Super Admin with this email already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const superAdmin = await this.userModel.create({
      id: snowflakeIdGenerator.generate(),
      ...dto,
      password: hashedPassword,
      is_super_admin: true,
      user_type: UserType.SUPER_ADMIN,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = this.jwtService.sign(
      { userId: superAdmin.id, otp },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30m',
      },
    );

    // Log (Replace with actual email service)
    this.logger.log(`Verification email sent to: ${superAdmin.email}`);
    this.logger.log(`Verification Token: ${otpToken}`);
    this.logger.log(`Verification OTP: ${otp}`);

    return {
      message: 'Super Admin created successfully. Please verify your email.',
      token: otpToken,
      otp: otp,
    };
  }

  async verifySuperAdminEmail(token?: string, otp?: string): Promise<any> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    if (!otp) {
      throw new BadRequestException('OTP is required');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new BadRequestException('JWT secret is not configured');
      }
      const decoded = this.jwtService.verify(token, { secret });
      const user = await this.userModel.findByPk(decoded.userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (user.is_verified) {
        throw new BadRequestException('Email already verified');
      }

      if (otp && otp !== decoded.otp) {
        throw new BadRequestException('Invalid OTP');
      }
      user.is_verified = true;
      await user.save();

      this.logger.log(
        `Email verified successfully for Super Admin: ${user.email}`,
      );
      return {
        message: 'Email verified successfully',
        userId: user.id,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error verifying token or OTP', error);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async login(identifier: string, password: string) {
    let user: Staffs | User | null = await this.staffModel.findOne({
      where: { staff_id: identifier },
    });

    let userType = 'staff';
    if (!user) {
      user = await this.userModel.findOne({ where: { email: identifier } });
      userType = 'user';
    }
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: userType,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken, user };
  }

  async requestPasswordReset(
    email: string,
  ): Promise<{ message: string; otp: string; token: string }> {
    let user: User | Staffs | null = await this.userModel.findOne({
      where: { email },
    });
    let userType = 'user';

    if (!user) {
      user = await this.staffModel.findOne({ where: { email } });
      userType = 'staff';
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = this.jwtService.sign(
      { userId: user.id, otp, userType },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30m',
      },
    );
    this.logger.log(`Password reset OTP sent to: ${user.email}`);
    this.logger.log(`OTP: ${otp}`);
    this.logger.log(`Token: ${otpToken}`);

    return {
      message: 'Password reset OTP has been sent successfully',
      otp,
      token: otpToken,
    };
  }

  async verifyResetPasswordOtp(
    token: string,
    otp: string,
  ): Promise<{ userId: string; token: string }> {
    if (!token || !otp) {
      throw new BadRequestException('Token and OTP are required');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });

      if (otp !== decoded.otp) {
        throw new BadRequestException('Invalid OTP');
      }

      const user = await this.userModel.findByPk(decoded.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return { userId: user.id, token };
    } catch (error) {
      this.logger.error('Error verifying OTP:', error);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async resetPassword(
    resetToken: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!resetToken) {
      throw new BadRequestException('Invalid or missing reset token.');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(resetToken, { secret });
      const user = await this.userModel.findByPk(decoded.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await user.update({ password: hashedPassword });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      this.logger.error('Reset password error:', error);
      throw new UnauthorizedException(
        'OTP verification required before resetting password.',
      );
    }
  }
}
