import { Injectable, UnauthorizedException, Logger, BadRequestException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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
      await this.employeeRepository.save(newEmployee);
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

  async findOne(id: string) {
    const datadb = await this.employeeRepository.findOne({where: {id}});
    return datadb ?? null
  }

  async findOneCustom(whereParam: any) {
    const user = await this.employeeRepository.findOne({where: whereParam});
    return user === null ? undefined : user;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
    try {
      const user = await this.employeeRepository.findOne({where: {id}});
      if(!user){
        throw new NotFoundException();
      }
      const formData = {
        ...updateEmployeeDto,
        phone: updateEmployeeDto.phone ? this.encryptionService.encrypt(updateEmployeeDto.phone) : '',
        address: updateEmployeeDto.address ? this.encryptionService.encrypt(updateEmployeeDto.address) : '',
      }
      await this.employeeRepository.update(id, formData)

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, deleteEmployeeDto: DeleteEmployeeDto) {
    try {
      const user = await this.employeeRepository.findOne({where: {id}});
      if(!user){
        throw new NotFoundException();
      }
      const formData = {
        ...deleteEmployeeDto,
        isActive: user.isActive == true ? false : true
      }
      await this.employeeRepository.update(id, formData)
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async uploadProfilePicture(
    id: string,
    file: Express.Multer.File
  ){
    try {
      const main = await this.employeeRepository.findOneBy({id})
      
      if(!main){
        throw new NotFoundException()
      }

      if(main.profilePicture){ // Remove Old Picture to maintain storage
        try {
          await this.sftpService.deleteFile(main.profilePicture)
        } catch (error) {
          throw new InternalServerErrorException("Can't Remove File")
        }
      }

      const extension = file.originalname.split('.').pop()
      const fileName = `employee_${main.id}.${extension}`

      await this.sftpService.uploadFile(file.buffer, fileName)
      await this.employeeRepository.update(id, {
        profilePicture: fileName
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload attachment: ' + error.message);
    }
  }

  async exportExcel(department: string): Promise<Buffer>{
    try {
      const datadb = await this.employeeRepository.findBy({department, isActive: true})
      const workbook = new ExcelJs.Workbook()
      const worksheet = workbook.addWorksheet() // name of sheets

      worksheet.columns = [
        { header: 'Name', key: 'name'},
        { header: 'Email', key: 'email'},
        { header: 'Department', key: 'department'},
        { header: 'Position', key: 'position'},
        { header: 'Hired Date', key: 'hireDate'},
      ];

      datadb.forEach((value) => {
        worksheet.addRow({
          name: value.firstName + ' ' + value.lastName,
          email: value.email,
          department: value.department,
          position: value.position,
          hireDate: value.hireDate,
        })
      })

      const headerRow = worksheet.getRow(1);
      // Style font + fill (warna background)
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }, // abu-abu muda
        };

        // Kasih border di setiap cell header
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Optional: rata tengah
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      return Buffer.from(await workbook.xlsx.writeBuffer())
    } catch (error) {
      throw new BadRequestException('Failed to export to Excel: ' + error.message);
    }
  }

}
