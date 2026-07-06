import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { CategoriesComponent } from './categories/categories.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { WhyUsComponent } from './why-us/why-us.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    CategoriesComponent,
    FeaturedProductsComponent,
    WhyUsComponent,
    FooterComponent
  ],
})
export class HomeComponent implements OnInit {

  featuredProducts: Product[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.loadFeaturedProducts();

  }

  loadFeaturedProducts(): void {

    this.productsService.getAllProducts().subscribe({

      next: (products) => {

        this.featuredProducts = products.slice(0, 8);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}