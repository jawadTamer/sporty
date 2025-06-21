import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
// @ts-ignore: no types for aos
import * as AOS from 'aos';

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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
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
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
    // Initialize AOS animations
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
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
    if (!this.selectedSize || !this.selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select both size and color before adding to cart.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.quantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please select a valid quantity.',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (!user || !user.uid) {
        Swal.fire({
          icon: 'info',
          title: 'Login Required',
          text: 'Please log in to add items to your cart.',
          confirmButtonText: 'Login',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
        return;
      }
      this.cartService.addToCart(this.product!, this.quantity);
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${this.product!.name} (${this.selectedSize}, ${
          this.selectedColor
        }) has been added to your cart.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    });
  }
}
