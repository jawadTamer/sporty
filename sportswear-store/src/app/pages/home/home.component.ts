import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
// @ts-ignore: no types for aos
import * as AOS from 'aos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatChipsModule,
    MatProgressSpinnerModule,
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
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(() => {
      this.loading = false;
    });
    this.loadFeaturedProducts();
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
  }

  async loadFeaturedProducts(): Promise<void> {
    try {
      const products = await this.productService.getProducts();
      this.featuredProducts = products.slice(0, 4); // Get first 4 products
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }

  addToCart(product: Product): void {
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
      this.cartService.addToCart(product, 1);
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.name} has been added to your cart.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    });
  }
}
