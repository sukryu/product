import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDtos {
  @ApiProperty({ example: 'category name'})
  @IsString()
  @IsNotEmpty()
  readonly name: string | null;

  @ApiProperty({ example: 'category description' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}