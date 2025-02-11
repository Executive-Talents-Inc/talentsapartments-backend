import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserType } from './models/iam.model';
import { Staffs } from '../talentscholar/models/staff.model';
import { SnowflakeIdGenerator } from '../../utils/idGenerator';

const snowflakeIdGenerator = new SnowflakeIdGenerator();

@Injectable()
export class IamService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Staffs) private readonly staffModel: typeof Staffs,
    private readonly jwtService: JwtService,
  ) {}

  async createSuperAdmin(dto: CreateSuperAdminDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Super Admin with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const superAdmin = await this.userModel.create({
      id: snowflakeIdGenerator.generate(),
      ...dto,
      password: hashedPassword,
      is_super_user: true, 
      user_type: UserType.SUPER_ADMIN,
    });

    return superAdmin;
  }


  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
  
  async login(identifier: string, password: string) {
    let user: Staffs | User | null = await this.staffModel.findOne({ where: { staff_id: identifier } });
  
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
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' } );
    return { accessToken, user };
  }
    
}
