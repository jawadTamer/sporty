import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { MatDivider } from '@angular/material/divider';

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
    MatDivider
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  user$ = this.authService.user$;
  isAdmin$ = this.authService.isAdmin();

  constructor(private authService: AuthService) {}

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
