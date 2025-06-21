import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDivider,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  user$ = this.authService.currentUser$;
  isAdmin$ = this.authService.isAdmin();
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map((cart) => cart.reduce((total, item) => total + item.quantity, 0))
    );
  }

  async signOut(): Promise<void> {
    const result = await Swal.fire({
      title: 'Sign Out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign out',
    });

    if (result.isConfirmed) {
      try {
        await this.authService.signOut();

        Swal.fire({
          icon: 'success',
          title: 'Signed Out',
          text: 'You have been successfully signed out.',
          timer: 2000,
          showConfirmButton: false,
        });

        this.router.navigate(['/']);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Sign Out Failed',
          text: 'There was an error signing out. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    }
  }
}
