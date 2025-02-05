import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const sequelize: Sequelize = app.get(Sequelize);
  try {
    await sequelize.authenticate();
    logger.log('Database connected successfully! 🚀🚀');
  } catch (error) {
    logger.error('Unable to connect to the database:', error.message);
  }

  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const documentationOptions = new DocumentBuilder()
    .setTitle('TALENTS API DOCS')
    .setDescription('The Talent App API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, documentationOptions);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000; 
  await app.listen(PORT, () => {
    logger.log(`\n\nApplication listening on port ${PORT}. Talent Apartments 🚀`);
  });
}
bootstrap();
