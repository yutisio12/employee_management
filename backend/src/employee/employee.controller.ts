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
  Res,
  ParseIntPipe,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { EmployeeService } from './employee.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';

@ApiTags('Employee')
@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const checkEmail = await this.employeeService.findOneCustom({ email: createEmployeeDto.email });
    if(checkEmail){
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Email already exists, please use another email'
      }
    }
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('list')
  findAll(@Query() query: PaginationQueryDto) {
    return this.employeeService.findAll(query);
  }

  @Get('list:id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete('update:id')
  remove(@Param('id') id: string) {
    const deleteEmployeeDto: DeleteEmployeeDto = { isActive: false };
    return this.employeeService.remove(+id, deleteEmployeeDto);
  }
}
