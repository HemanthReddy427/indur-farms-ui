import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product.model';
import { ProductsService } from '../../../../Services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListAdminComponent implements OnInit {

  products: Product[] = [];

  filteredProducts: Product[] = [];

  loading = false;

  searchText = '';

  constructor(
    private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  loadProducts(): void {

    this.loading = true;

    this.productService.getAllProducts().subscribe({

      next: (response) => {

        this.products = response;

        this.filteredProducts = response;

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  search(event: Event): void {

    const value = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(value)
    );

  }

  addProduct(): void {

    this.router.navigate(['/admin/products/add']);

  }

  editProduct(id: number): void {

    this.router.navigate(['/admin/products/edit', id]);

  }

  deleteProduct(id: number): void {

    if (!confirm('Are you sure you want to delete this product?')) {

      return;

    }

    this.productService.deleteProduct(id).subscribe({

      next: () => {

        this.loadProducts();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}