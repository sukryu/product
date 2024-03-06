import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductsModule, ReviewsModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
