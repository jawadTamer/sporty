import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService, User } from '../../../services/auth.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  displayedColumns: string[] = ['avatar', 'name', 'email', 'role', 'actions'];
  loading = true;
  searchTerm = '';

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.users$ = this.authService.getAllUsers();
    this.filteredUsers$ = this.users$;
  }

  ngOnInit(): void {
    this.users$.subscribe(() => {
      this.loading = false;
    });
  }

  // Search functionality
  onSearchChange(): void {
    this.filteredUsers$ = this.users$.pipe(
      map((users) => {
        if (!this.searchTerm.trim()) {
          return users;
        }
        const searchLower = this.searchTerm.toLowerCase();
        return users.filter(
          (user) =>
            user.displayName?.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.role.toLowerCase().includes(searchLower)
        );
      })
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  getRoleColor(role: string): string {
    return role === 'admin' ? 'accent' : 'primary';
  }

  getRoleIcon(role: string): string {
    return role === 'admin' ? 'admin_panel_settings' : 'person';
  }

  getInitials(name: string | null | undefined): string {
    if (!name) {
      return '?';
    }
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  async changeUserRole(user: User, newRole: 'user' | 'admin'): Promise<void> {
    // Prevent changing own role to user (would lose admin access)
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser && currentUser.uid === user.uid && newRole === 'user') {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Change Own Role',
        text: 'You cannot change your own role to user as it would remove your admin access.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Change User Role',
      text: `Are you sure you want to change ${
        user.displayName || user.email
      }'s role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    });

    if (result.isConfirmed) {
      try {
        await this.authService.updateUserRole(user.uid, newRole);

        Swal.fire({
          icon: 'success',
          title: 'Role Updated!',
          text: `User role has been changed to ${newRole}.`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        // Refresh the users list
        this.users$ = this.authService.getAllUsers();
        this.onSearchChange();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update user role. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    }
  }

  async deleteUser(user: User): Promise<void> {
    // Prevent deleting the current user
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser && currentUser.uid === user.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete Current User',
        text: 'You cannot delete your own account while logged in.',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Prevent deleting the last admin
    const users = await this.users$.toPromise();
    const adminUsers = users?.filter((u) => u.role === 'admin') || [];
    if (user.role === 'admin' && adminUsers.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete Last Admin',
        text: 'You cannot delete the last administrator. Please promote another user to admin first.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete User',
      text: `Are you sure you want to delete ${
        user.displayName || user.email
      }? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user!',
    });

    if (result.isConfirmed) {
      try {
        await this.authService.deleteUser(user.uid);

        Swal.fire({
          icon: 'success',
          title: 'User Deleted!',
          text: 'User has been successfully deleted.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        // Refresh the users list
        this.users$ = this.authService.getAllUsers();
        this.onSearchChange();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: error.message || 'Failed to delete user. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    }
  }

  getTotalUsers(users: User[]): number {
    return users.length;
  }

  getAdminUsers(users: User[]): number {
    return users.filter((user) => user.role === 'admin').length;
  }

  getRegularUsers(users: User[]): number {
    return users.filter((user) => user.role === 'user').length;
  }
}
