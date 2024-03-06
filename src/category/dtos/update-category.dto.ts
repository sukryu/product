import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateCategoryDtos } from "./create-category.dto";

export class UpdateCategoryDtos extends PartialType(CreateCategoryDtos) {
  @ApiProperty({ example: 'category name'})
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ example: 'category description' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}