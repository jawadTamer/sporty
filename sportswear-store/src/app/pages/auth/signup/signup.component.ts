import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const { displayName, email, password } = this.signupForm.value;
        await this.authService.signUp(email, password, displayName);

        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been successfully created. Welcome!',
          timer: 2000,
          showConfirmButton: false,
        });

        this.router.navigate(['/']);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: error.message || 'Signup failed. Please try again.',
          confirmButtonText: 'OK',
        });
      } finally {
        this.loading = false;
      }
    }
  }

  getErrorMessage(field: string): string {
    const control = this.signupForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'email' && control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field === 'password' && control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (field === 'displayName' && control?.hasError('minlength')) {
      return 'Name must be at least 2 characters long';
    }
    if (field === 'confirmPassword' && control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
