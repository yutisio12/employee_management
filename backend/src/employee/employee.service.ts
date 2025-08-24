import { Injectable, UnauthorizedException, Logger, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.employee.entity';
import { EncryptionService } from 'src/utils/encryption.service';
import { SftpService } from 'src/utils/sftp.service';
import * as ExcelJs from 'exceljs';
import * as puppeteer from 'puppeteer';
import * as bcrypt from 'bcryptjs';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    @InjectRepository(Employee, 'employeeConnection')
    private employeeRepository: Repository<Employee>,
    private encryptionService: EncryptionService,
    private sftpService: SftpService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    try {
      const encryptedData = {
        ...createEmployeeDto,
        // email: this.encryptionService.encrypt(createEmployeeDto.email),
        phone: this.encryptionService.encrypt(createEmployeeDto.phone),
        address: createEmployeeDto.address
          ? this.encryptionService.encrypt(createEmployeeDto.address)
          : '',
      };
      
      const newEmployee = this.employeeRepository.create(encryptedData);
      const savedEmployee = await this.employeeRepository.save(newEmployee);
      const returnNewEmployee = {
        ...newEmployee,
        email: createEmployeeDto.email,
        phone: createEmployeeDto.phone,
        address: createEmployeeDto.address,
      }
      return returnNewEmployee;
    } catch (error) {
      this.logger.error('Error creating employee', error.stack);
      throw new BadRequestException('Failed to create employee');
    }
  }

  async findAll(query: PaginationQueryDto) {
    const { page, limit, sort, search } = query;
    const where: any = {};

    const datadb = this.employeeRepository.createQueryBuilder('employees');
    if(search){
      datadb.where('employees.firstName LIKE :search OR employees.lastName LIKE :search OR employees.email LIKE :search', { search: `%${search}%` });
    }

    if(sort){
      const [sortField, sortOrder] = sort.split(',');
      datadb.orderBy(`employees.${sortField}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    }
    datadb.skip((page - 1) * limit).take(limit);
    const [data, total] = await datadb.getManyAndCount();
    return new PaginationResponseDto(data, total, page, limit);
  }

  findOne(id: number) {
    return `This action returns a #id employee`;
  }

  async findOneCustom(whereParam: any) {
    const user = await this.employeeRepository.findOne({where: whereParam});
    return user === null ? undefined : user;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #id employee`;
  }

  remove(id: number, deleteEmployeeDto: DeleteEmployeeDto) {
    return `This action removes a #id employee`;
  }
}
