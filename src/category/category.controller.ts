import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Header, Headers, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { CategoryService } from './category.service';
import { CreateCategoryDtos } from './dtos/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDtos } from './dtos/update-category.dto';
import { QueryCategoryDto } from './dtos/query-category.dto';
import { InfinityPaginationResultType } from 'src/utility/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utility/infinity-pagination';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
  async create(@Headers('Authorization') authHeader: string, @Body() createCategory: CreateCategoryDtos): Promise<Category> {
    const token = authHeader.split(' ')[0];
    try {
      if (token === undefined || createCategory === undefined) {
        this.logger.error(`token or createCategory is undefined`);
        throw new BadRequestException(`token or createCategory is undefined`);
      }

      const user = await this.apiService.validateUser(token);
      if (!user) {
        this.logger.error(`User is not found`);
        throw new NotFoundException(`user not found`);
      }

      if (user.roles !== 'admin') {
        this.logger.error(`User is not admin`);
        throw new ConflictException(`user is not admin permission denied`);
      }

      return await this.service.createCategory(createCategory);
    } catch (error) {
      this.logger.error(`An error occured when creating Category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  @Patch()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Headers('Authorization') authHeader: string, @Body() id: number, @Body() updatedData: UpdateCategoryDtos): Promise<Category> {
    const token = authHeader.split(' ')[0];
    try {
      if (token === undefined || id === undefined || updatedData === undefined) {
        this.logger.error(`Id or token or updatedData is undefined`);
        throw new BadRequestException(`Id or token or updatedData is undefined`)
      }

      const admin = await this.apiService.validateUser(token);
      if (!admin) {
        this.logger.error(`Admin is not found`);
        throw new NotFoundException(`admin not found`);
      }

      if (admin.roles !== 'admin') {
        this.logger.error(`Admin is not admin`);
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
  async deleteCategory(@Param('id') id: number, @Headers('Authorization') authHeader: string): Promise<void> {
    const token = authHeader.split(' ')[0];
    try {
      if (id === undefined || token === undefined) {
        this.logger.error(`id or token is undefined`);
        throw new BadRequestException(`id or token is undefined`);
      }

      const admin = await this.apiService.validateUser(token);
      if (!admin) {
        this.logger.error(`admin not found`);
        throw new NotFoundException(`admin not found`);
      }

      if (admin.roles !== 'admin') {
        this.logger.error(`Admin is not admin`);
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