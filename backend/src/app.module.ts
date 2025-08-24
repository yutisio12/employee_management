import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { getAuthDbConfig, getEmployeeDbConfig } from './config/database.config';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    EmployeeModule,
    EmployeeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Login Database Connection
    TypeOrmModule.forRootAsync({
      name: 'authConnection',
      imports: [ConfigModule],
      useFactory: getAuthDbConfig,
      inject: [ConfigService],
    }),
    // Employee Database Connection
    TypeOrmModule.forRootAsync({
      name: 'employeeConnection',
      imports: [ConfigModule],
      useFactory: getEmployeeDbConfig,
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    EmployeeModule,
  ],
})
export class AppModule {}
