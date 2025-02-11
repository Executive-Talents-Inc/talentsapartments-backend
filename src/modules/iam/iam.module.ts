import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/iam.model';
import { JwtStrategy } from '../talentscholar/guards/jwt.strategy';
import { Staffs } from '../talentscholar/models/staff.model';


@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Staffs]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [IamController],
  providers: [IamService,JwtStrategy],
  exports: [IamService],
})
export class IamModule {}
