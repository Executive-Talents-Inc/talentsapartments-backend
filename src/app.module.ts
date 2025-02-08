import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './modules/iam/iam.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TalentscholarModule } from './modules/talentscholar/talentscholar.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    IamModule,
    PaymentModule,
    TalentscholarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
