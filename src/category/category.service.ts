import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ICategoryService } from './category';
import { CreateCategoryDtos } from './dtos/create-category.dto';
import { IPaginationOptions } from 'src/utility/types/pagination-options.type';
import { SortCategoryDto } from './dtos/query-category.dto';
import { ApiService } from 'src/api/api.service';

@Injectable()
export class CategoryService implements ICategoryService{
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly apiService: ApiService,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDtos): Promise<Category> {
    try {
      const existsCategory = await this.categoryRepo.findOne({
        where: { name: createCategoryDto.name },
      });

      if (existsCategory) throw new ConflictException(`Category already exists`);

      const category = this.categoryRepo.create(createCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal Server Error : ${error}`);
    }
  }
  async updateCategory(id: number, updatedData: DeepPartial<Category>): Promise<Category> {
    
    let update: any = {};
    
    try {
      const category = await this.categoryRepo.findOne({ where: { id } });
      if (!category) throw new ConflictException(`Category not found`);

      if (updatedData.name) update.name = updatedData.name;
      if (updatedData.description) update.description = updatedData.description;

      return await this.categoryRepo.save({ ...category, ...update });
    } catch (error) {
      this.logger.error(`An error occured when updating category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const user = await this.apiService.validateUser(id);
      if (!user) throw new NotFoundException(`user not found`);
      
      if (user.roles !== 'admin') throw new ConflictException(`You are not authorized to perform this action`);

      const category = await this.categoryRepo.findOne({ where: { id }});
      if (!category) { 
        throw new BadRequestException(`Category not found`);
      }

      await this.categoryRepo.update(id, { isDeleted: true });
      await this.categoryRepo.softDelete(id);
      this.logger.debug(`Successfully soft deleted category : ${id}`);
    } catch (error) {
      this.logger.error(`An error occured when deleting category : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  async findManyWithPagination({ 
    sortOptions, 
    paginationOptions, 
  }: { 
    sortOptions: SortCategoryDto[]; 
    paginationOptions: IPaginationOptions; 
  }): Promise<Category[]> {
    const where: FindOptionsWhere<Category> = {};
    return this.categoryRepo.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (accmulator, sort) => ({
          ...accmulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
  }

  async getCategoryByName(name: string): Promise<Category> {
    try {
      if (!name) throw new BadRequestException(`Name was not provided`);

      const category = await this.categoryRepo.findOne({ where: { name }});

      if (!category) throw new NotFoundException(`Category not found`);

      if (category.isDeleted === true) throw new BadRequestException(`Category is already deleted : ${category.name}`);

      return category;
    } catch (error) {
      this.logger.error(`An error occured when get Category By Name : ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      if (!id){
        this.logger.error(`Id was not provided`); 
        throw new BadRequestException(`Id was not provided`);
      }

      const category = await this.categoryRepo.findOne({ where: { id }});
      if (!category) {
        this.logger.error(`Category not found`);
        throw new NotFoundException(`Category not found`);
      }

      if (category.isDeleted === true) {
        throw new BadRequestException(`This Category is already deleted : ${category.name}`);
      }
      return category;
    } catch (error) {
      this.logger.error(`An error occured when get category ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }
}
