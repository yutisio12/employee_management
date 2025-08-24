import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from '../entities/employee.employee.entity';
import { EncryptionService } from 'src/utils/encryption.service';
import { SftpService } from 'src/utils/sftp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee], 'employeeConnection')],
  controllers: [EmployeeController],
  providers: [EmployeeService, EncryptionService, SftpService],
  exports: [],
})
export class EmployeeModule {}
