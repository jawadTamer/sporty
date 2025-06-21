import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cart$: Observable<CartItem[]>;
  checkoutForm!: FormGroup;
  loading = false;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.cart$ = this.cartService.cart$;
    this.initCheckoutForm();
  }

  private initCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
    });
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  onQuantityChange(event: Event, productId: string) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (value > 0) {
      this.updateQuantity(productId, value);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  async checkout(): Promise<void> {
    if (this.checkoutForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
      });
      return;
    }

    const user = await this.authService.getCurrentUser();
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to complete your order.',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    const cart = this.cartService.getCart();
    if (cart.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Empty Cart',
        text: 'Your cart is empty.',
      });
      return;
    }

    this.loading = true;

    try {
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        userEmail: user.email || '',
        items: cart,
        total: this.getTotal(),
        status: 'pending',
        shippingAddress: this.checkoutForm.value,
      };

      const orderId = await this.orderService.createOrder(orderData);

      // Clear the cart after successful order
      this.cartService.clearCart();

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: `Your order has been placed successfully. Order ID: ${orderId}`,
        timer: 3000,
        showConfirmButton: false,
      });

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: 'There was an error placing your order. Please try again.',
      });
    } finally {
      this.loading = false;
    }
  }
}
