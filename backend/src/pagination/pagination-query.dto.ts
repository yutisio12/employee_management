import { IsInt, IsOptional, IsString, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt,DESC';

  @IsOptional()
  @IsString()
  search?: string;
}