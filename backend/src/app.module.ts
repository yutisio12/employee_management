import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { getAuthDbConfig } from './config/database.config';

@Module({
  imports: [
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
    // // Employee Database Connection
    // TypeOrmModule.forRootAsync({
    //   name: 'employeeConnection',
    //   imports: [ConfigModule],
    //   useFactory: getEmployeeDatabaseConfig,
    //   inject: [ConfigService],
    // }),
    CommonModule,
    AuthModule,
    // EmployeeModule,
  ],
})
export class AppModule {}
