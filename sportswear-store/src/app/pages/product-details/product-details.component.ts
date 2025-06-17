import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedSize = '';
  selectedColor = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  async loadProduct(productId: string): Promise<void> {
    try {
      this.product = await this.productService.getProductById(productId);
      if (this.product) {
        this.selectedSize = this.product.sizes[0] || '';
        this.selectedColor = this.product.colors[0] || '';
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      this.loading = false;
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.selectedSize && this.selectedColor) {
      // TODO: Implement cart functionality
      console.log('Adding to cart:', {
        product: this.product,
        size: this.selectedSize,
        color: this.selectedColor,
        quantity: this.quantity,
      });
    }
  }
}
