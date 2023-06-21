import { Injectable } from '@nestjs/common';
import { CategoriesSeeder } from './category-seeder';
import { ProductsSeeder } from './product-seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private categoriesSeeder: CategoriesSeeder,
    private productsSeeder: ProductsSeeder,
  
  ) {}

  async run() {
    await this.categoriesSeeder.run();
    await this.productsSeeder.run();
  }
}