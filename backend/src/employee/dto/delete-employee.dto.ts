import {
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEmployeeDto {

  @ApiProperty({ example: true, required: true })
  @IsOptional()
  isActive: boolean;

}