import { DeepPartial } from "typeorm";
import { CreateCategoryDtos } from "./dtos/create-category.dto";
import { Category } from "./entities/category.entity";
import { SortCategoryDto } from "./dtos/query-category.dto";
import { IPaginationOptions } from "src/utility/types/pagination-options.type";

export interface ICategoryService {
  createCategory(createCategoryDto: CreateCategoryDtos): Promise<Category>;
  updateCategory(id: number, updatedData: DeepPartial<Category>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions: SortCategoryDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]>;

  getCategoryByName(name: string): Promise<Category>;
  getCategoryById(id: number): Promise<Category>;
}