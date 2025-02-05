import { SequelizeModuleOptions } from '@nestjs/sequelize'; 
import * as dotenv from 'dotenv';

dotenv.config();


export const sequelizeConfig: SequelizeModuleOptions = {
dialect: 'postgres', 
  host: process.env.DATABASE_HOST, 
  port: Number(process.env.DATABASE_PORT), 
  username: process.env.DATABASE_USERNAME, 
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_NAME, 
  models: [], 
  logging: false, 
  ssl: process.env.DATABASE_SSL === 'true', 
  dialectOptions: {
    ssl: process.env.DATABASE_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
};
