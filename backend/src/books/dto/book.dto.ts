import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
