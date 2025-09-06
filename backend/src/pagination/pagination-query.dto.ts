import { IsInt, IsOptional, IsString, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ description: 'Page', default: '1' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Limit', default: '10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ description: 'Sort&Order', default: 'createdAt,DESC' })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt,DESC';

  @ApiProperty({ description: 'Search', default: '', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}