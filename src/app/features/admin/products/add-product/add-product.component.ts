import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../../Services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  productForm: FormGroup;

  selectedImage!: File;

  imagePreview: string | ArrayBuffer | null = null;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router
  ) {

    this.productForm = this.fb.group({

      name: ['', Validators.required],

      description: ['', Validators.required],

      price: ['', Validators.required],

      stock: ['', Validators.required]

    });

  }

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {

      return;

    }

    this.selectedImage = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview = reader.result;

    };

    reader.readAsDataURL(this.selectedImage);

  }

  saveProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }

    if (!this.selectedImage) {

      alert("Please select an image.");

      return;

    }

    const formData = new FormData();

    formData.append("Name", this.productForm.value.name);

    formData.append("Description", this.productForm.value.description);

    formData.append("Price", this.productForm.value.price);

    formData.append("Stock", this.productForm.value.stock);

    formData.append("Image", this.selectedImage);

    this.isSubmitting = true;

    this.productService.addProduct(formData).subscribe({

      next: () => {

        alert("Product Added Successfully");

        this.router.navigate(['/admin/products']);

      },

      error: err => {

        console.error(err);

        this.isSubmitting = false;

      }

    });

  }

  cancel(): void {

    this.router.navigate(['/admin/products']);

  }

}