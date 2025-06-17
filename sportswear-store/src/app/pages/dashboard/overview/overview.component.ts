import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  stats = {
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    totalCategories: 0,
  };

  recentProducts: any[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      const products = await this.productService.getProducts();

      this.stats.totalProducts = products.length;
      this.stats.inStockProducts = products.filter((p) => p.inStock).length;
      this.stats.outOfStockProducts = products.filter((p) => !p.inStock).length;

      const categories = new Set(products.map((p) => p.category));
      this.stats.totalCategories = categories.size;

      this.recentProducts = products
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }
}
