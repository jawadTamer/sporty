import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService, Product } from '../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'price',
    'stock',
    'actions',
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await this.productService.deleteProduct(productId);
        this.products = this.products.filter((p) => p.id !== productId);

        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to delete product. Please try again.',
          'error'
        );
      }
    }
  }

  toggleStockStatus(product: Product): void {
    // TODO: Implement stock status toggle
    console.log('Toggle stock status for:', product.name);
  }
}
