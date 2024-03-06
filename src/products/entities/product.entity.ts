import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ownerId '})
  @IsNumber()
  @MinLength(1)
  @MaxLength(50)
  @Column({ type: Number })
  ownerId: number;

  @ApiProperty({ example: 'milk'})
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Column({ type: String })
  name: string;

  @ApiProperty({ example: '1000'})
  @IsNumber()
  @MinLength(3)
  @MaxLength(50)
  @Column({ type: Number })
  price: number;

  @ApiProperty({ example: '3' })
  @IsNumber()
  @MinLength(1)
  @MaxLength(50)
  @Column({ type: Number })
  quantity: number;

  @ApiProperty({ example: 'file path'})
  @IsString()
  @IsOptional()
  @Column({ type: String })
  photo: string;

  @ApiProperty({ example: 'description'})
  @IsString()
  @IsOptional()
  @Column({ type: String })
  description: string;
}