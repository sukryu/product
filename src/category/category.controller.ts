import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { CategoryService } from './category.service';
import { CreateCategoryDtos } from './dtos/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDtos } from './dtos/update-category.dto';
import { QueryCategoryDto } from './dtos/query-category.dto';
import { InfinityPaginationResultType } from 'src/utility/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utility/infinity-pagination';

@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(
    private readonly apiService: ApiService,
    private readonly service: CategoryService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id') userId: number, @Body() createCategory: CreateCategoryDtos): Promise<Category> {
    try {
      if (userId === undefined || createCategory === undefined) {
        this.logger.error(`userId or createCategory is undefined`);
        throw new BadRequestException(`userId or createCategory is undefined`);
      }

      const user = await this.apiService.validateUser(userId);
      if (!user) {
        this.logger.error(`User ${userId} is not found`);
        throw new NotFoundException(`user not found`);
      }

      if (user.roles !== 'admin') {
        this.logger.error(`User ${userId} is not admin`);
        throw new ConflictException(`user is not admin permission denied`);
      }

      return await this.service.createCategory(createCategory);
    } catch (error) {
      this.logger.error(`An error occured when creating Category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: number, @Body() adminId: number, @Body() updatedData: UpdateCategoryDtos): Promise<Category> {
    try {

      if (id === undefined || adminId === undefined || updatedData === undefined) {
        this.logger.error(`Id or AdminId or updatedData is undefined`);
        throw new BadRequestException(`Id or AdminId or updatedData is undefined`)
      }

      const admin = await this.apiService.validateUser(adminId);
      if (!admin) {
        this.logger.error(`Admin ${adminId} is not found`);
        throw new NotFoundException(`admin not found`);
      }

      if (admin.roles !== 'admin') {
        this.logger.error(`Admin ${adminId} is not admin`);
        throw new ConflictException(`admin is not admin permission denied`);
      }

      return await this.service.updateCategory(id, updatedData);
    } catch (error) {
      this.logger.error(`An error occured when updating category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: number, @Body() adminId: number): Promise<void> {
    try {
      if (id === undefined || adminId === undefined) {
        this.logger.error(`id or adminId is undefined`);
        throw new BadRequestException(`id or adminId is undefined`);
      }

      const admin = await this.apiService.validateUser(adminId);
      if (!admin) {
        this.logger.error(`admin ${adminId} not found`);
        throw new NotFoundException(`admin not found`);
      }

      if (admin.roles !== 'admin') {
        this.logger.error(`Admin ${adminId} is not admin`);
        throw new ConflictException(`admin is not admin permission denied`);
      }

      await this.service.deleteCategory(id);
    } catch (error) {
      this.logger.error(`An error occured when deleting category ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllCategory(@Query() query: QueryCategoryDto): Promise<InfinityPaginationResultType<Category>> {
    const page = query?.page || 1;
    let limit = query?.limit || 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.service.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('/by-id')
  @HttpCode(HttpStatus.OK)
  async getCategoryById(@Query('id') id: number): Promise<Category> {
    try {
      if (id === undefined) {
        this.logger.error(`id is undefined`);
        throw new BadRequestException(`id is undefined`);
      }

      return await this.service.getCategoryById(id);
    } catch (error) {
      this.logger.error(`An error occured when getting category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  @Get('/by-name')
  @HttpCode(HttpStatus.OK)
  async getCategoryByName(@Query('name') name: string): Promise<Category> {
    try {
      if (name === undefined) {
        this.logger.error(`id is undefined`);
        throw new BadRequestException(`id is undefined`);
      }

      return await this.service.getCategoryByName(name);
    } catch (error) {
      this.logger.error(`An error occured when getting category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }
}