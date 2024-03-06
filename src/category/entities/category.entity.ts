import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'category'})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'category name'})
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @Column({ unique: true })
  name: string | null;

  @ApiProperty({ example: 'category description'})
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Column({ nullable: true })
  description: string | null;

  @ApiProperty({ example: 'True or False'})
  @IsBoolean()
  @Column({ type: Boolean, default: false })
  isDeleted: boolean;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}