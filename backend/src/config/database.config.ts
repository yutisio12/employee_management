import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getAuthDbConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_AUTH_HOST'),
  port: configService.get('DB_AUTH_PORT'),
  username: configService.get('DB_AUTH_USERNAME'),
  password: configService.get('DB_AUTH_PASSWORD'),
  database: configService.get('DB_AUTH_DATABASE'),
  entities: ['dist/**/*.auth.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
})

export const getEmployeeDbConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_EMPLOYEE_HOST'),
  port: configService.get('DB_EMPLOYEE_PORT'),
  username: configService.get('DB_EMPLOYEE_USERNAME'),
  password: configService.get('DB_EMPLOYEE_PASSWORD'),
  database: configService.get('DB_EMPLOYEE_DATABASE'),
  entities: ['dist/**/*.employee.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
})