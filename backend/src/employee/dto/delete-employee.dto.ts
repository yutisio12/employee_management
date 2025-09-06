import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsDateString,
  IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DeleteEmployeeDto {
  @ApiProperty({ example: "88ed0a46-af26-4131-b4c4-811bb25436ce, 4c6d77f9-9063-4904-8cf5-fd555ef7595a, dd65f5e2-be7f-479d-8aa5-45d08f36c6fe, 4b769b90-8551-46ca-ab85-a7418641f14e, 0c53ab48-292b-4bd9-93e6-3ecae91debc1, 39c2a14d-8462-4f58-8433-94a5d60aa508, 001bd14b-24b0-45e1-89fc-65a847a5b451, 0d363339-18dd-4606-9907-a0f1baa47c83, 27de0bec-46f8-45d6-a428-2ff429d9dcf0", description: "Comma separated employee IDs" })
  @Transform(({ value }) => value.split(',').map((v: string) => String(v.trim())))
  @IsArray()
  ids: string[];

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  isActive: boolean;
  
  @ApiProperty({ example: 'ee506892-46e3-4997-8ff2-306ed7435f0a', required: true })
  @IsString()
  deleteBy: string

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: true,
    example: new Date().toISOString(),
    description: 'Waktu penghapusan data (default: sekarang)'
  })
  @IsDateString()
  deleteDatetime: Date = new Date();

}