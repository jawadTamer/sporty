import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories = [
    { name: 'Running Shoes', icon: 'directions_run', color: '#4CAF50' },
    { name: 'Basketball', icon: 'sports_basketball', color: '#FF9800' },
    { name: 'Soccer', icon: 'sports_soccer', color: '#2196F3' },
    { name: 'Fitness', icon: 'fitness_center', color: '#9C27B0' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  async loadFeaturedProducts(): Promise<void> {
    try {
      const products = await this.productService.getProducts();
      this.featuredProducts = products.slice(0, 4); // Get first 4 products
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }
}
