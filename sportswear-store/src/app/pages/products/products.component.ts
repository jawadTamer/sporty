import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  selectedCategory = '';
  searchTerm = '';

  categories = [
    'All',
    'Running Shoes',
    'Basketball',
    'Soccer',
    'Fitness',
    'Tennis',
    'Swimming',
    'Athletic Wear',
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.products = await this.productService.getProducts();
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === '' ||
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesSearch =
        this.searchTerm === '' ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.filteredProducts = this.products;
  }
}
