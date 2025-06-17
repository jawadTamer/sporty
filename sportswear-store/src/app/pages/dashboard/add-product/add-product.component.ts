import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  productForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  categories = [
    'Running Shoes',
    'Basketball',
    'Soccer',
    'Fitness',
    'Tennis',
    'Swimming',
    'Athletic Wear',
  ];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11', '12'];
  colors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Pink',
    'Gray',
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      sizes: [[], Validators.required],
      colors: [[], Validators.required],
      inStock: [true],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleSelection(field: 'sizes' | 'colors', value: string): void {
    const currentValues = this.productForm.get(field)?.value || [];
    const index = currentValues.indexOf(value);

    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }

    this.productForm.get(field)?.setValue(currentValues);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid && this.selectedFile) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        // Upload image first
        const imageUrl = await this.productService.uploadImage(
          this.selectedFile
        );

        // Create product object
        const productData = {
          ...this.productForm.value,
          imageUrl,
        };

        // Add product to database
        await this.productService.addProduct(productData);

        this.successMessage = 'Product added successfully!';
        this.productForm.reset();
        this.selectedFile = null;
        this.imagePreview = null;

        // Redirect to products list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard/products']);
        }, 2000);
      } catch (error: any) {
        this.errorMessage =
          error.message || 'Failed to add product. Please try again.';
      } finally {
        this.loading = false;
      }
    } else if (!this.selectedFile) {
      this.errorMessage = 'Please select an image for the product.';
    }
  }

  getErrorMessage(field: string): string {
    const control = this.productForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'name' && control?.hasError('minlength')) {
      return 'Name must be at least 3 characters long';
    }
    if (field === 'description' && control?.hasError('minlength')) {
      return 'Description must be at least 10 characters long';
    }
    if (field === 'price' && control?.hasError('min')) {
      return 'Price must be greater than 0';
    }
    return '';
  }
}
