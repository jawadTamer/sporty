import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
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
