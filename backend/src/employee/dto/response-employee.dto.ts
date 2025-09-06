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
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEmployeeDto {
  @ApiProperty({ example: 'Encrypted ID' })
  @Exclude()
  id: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 'Encrypted email' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Encrypted Phone' })
  @Exclude()
  phone: string;

  @ApiProperty({ example: 'Manager' })
  @Expose()
  position: string;
  
  @ApiProperty({ example: 'IT' })
  @Expose()
  department: string;

  @ApiProperty({ example: 'Jauh', required: false })
  @Exclude()
  address: string;
  
  @ApiProperty({ example: '100000.22', required: false })
  @Exclude()
  salary: number;
  
  @ApiProperty({ example: '2024-01-15', required: false })
  @Exclude()
  hireDate: Date;

}