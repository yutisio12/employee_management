import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDateString,
  IsPhoneNumber,
  isEmail,
  isDecimal,
  IsDefined,
  IsDecimal
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'email@email.email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Manager' })
  @IsNotEmpty()
  position: string;
  
  @ApiProperty({ example: 'IT' })
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Jauh', required: false })
  @IsOptional()
  address: string;
  
  @ApiProperty({ example: '100000.22', required: false })
  @IsOptional()
  @IsDecimal()
  salary: number;
  
  @ApiProperty({ example: '2024-01-15', required: false })
  @IsDateString()
  hireDate: Date;

}