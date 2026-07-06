import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../Services/product.service';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  filteredProducts: Product[] = [];

  searchText = '';

  loading = true;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.loadProducts();

  }

  loadProducts(): void {

    this.productsService.getAllProducts().subscribe({

      next: (response) => {

        this.products = response;

        this.filteredProducts = response;

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  search(): void {

    const search = this.searchText.toLowerCase();

    this.filteredProducts = this.products.filter(product =>

      product.name.toLowerCase().includes(search) ||

      product.description.toLowerCase().includes(search)

    );

  }

}