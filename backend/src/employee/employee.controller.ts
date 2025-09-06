import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpStatus,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ResponseEmployeeDto } from './dto/response-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { EmployeeService } from './employee.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import type { Response } from 'express';
import { plainToInstance } from 'class-transformer';

@ApiTags('Employee')
@ApiBearerAuth('access-token') // sesuai nama di main.ts
@ApiCookieAuth('access-token')
@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('insert')
  async insert(@Body() createEmployeeDto: CreateEmployeeDto) {
    const checkEmail = await this.employeeService.findOneCustom({ email: createEmployeeDto.email });
    if(checkEmail){
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already exists, please use another email'
      }
    }
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('insert_batch')
  async insert_batch(@Body() createEmployeeDto: CreateEmployeeDto[]) {
    return this.employeeService.insert_batch(createEmployeeDto)
  }

  @Get('list')
  findAll(@Query() query: PaginationQueryDto) {
    return this.employeeService.findAll(query);
  }

  @Get('list/:id')
  async findById(@Param('id') id: string): Promise<ResponseEmployeeDto>  {
    const employee = await this.employeeService.findOneCustom({id:id});

    return plainToInstance(ResponseEmployeeDto, employee, {
    excludeExtraneousValues: false,
  });
  }


  @Get('export/:department')
  async export(@Res() res: Response, @Param('department') department: string) {
    const excel = await this.employeeService.exportExcel(department);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="employees-${new Date().toISOString().split('T')[0]}.xlsx"`,
      'Content-Length': excel.length,
    });
    
    res.end(excel);
  }

  @Post('upload_profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/
          })
        ]
      })
    ) file: Express.Multer.File
  ){
    const upload = await this.employeeService.uploadProfilePicture(body.id, file) 
    return upload
  }

  @Delete('delete/')
  async deleteEmployee(
    @Body() body: DeleteEmployeeDto,
  ){
    const deleteResult = await this.employeeService.deleteEmployee(body.ids, body)
    return deleteResult
  }

  // @Get('list/:id')
  // findOne(@Param('id') id: string) {
  //   return this.employeeService.findOne(id);
  // }

  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
  //   return this.employeeService.update(id, updateEmployeeDto);
  // }

  // @Delete('update/:id')
  // remove(@Param('id') id: string) {
  //   const deleteEmployeeDto: DeleteEmployeeDto = { isActive: false };
  //   return this.employeeService.remove(id, deleteEmployeeDto);
  // }
  
}
