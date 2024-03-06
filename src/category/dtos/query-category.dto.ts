import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Category } from "../entities/category.entity";
import { Transform, Type, plainToInstance } from "class-transformer";

export class SortCategoryDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Category;

  @ApiProperty()
  @IsString()
  order: "ASC" | "DESC";
}

export class QueryCategoryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => { return value ? plainToInstance(SortCategoryDto, JSON.parse(value)) : undefined; })
  @ValidateNested({ each: true })
  @Type(() => SortCategoryDto)
  sort?: SortCategoryDto[] | null; 
}