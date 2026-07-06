import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../Services/product.service';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { CartService } from '../../../Services/cart.service';
import { AddToCartRequest } from '../../../models/add-to-cart-request.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProductCardComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  relatedProducts: Product[] = [];

  quantity = 1;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadProduct(id);

    this.loadRelatedProducts(id);

  }

  loadProduct(id: number): void {

    this.productService.getProductById(id).subscribe({

      next: response => {

        this.product = response;

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  loadRelatedProducts(productId: number): void {

    this.productService.getAllProducts().subscribe({

      next: response => {

        this.relatedProducts = response
          .filter(x => x.id !== productId)
          .slice(0, 4);

      }

    });

  }

  increaseQuantity(): void {

    if (this.quantity < this.product.stock) {

      this.quantity++;

    }

  }

  decreaseQuantity(): void {

    if (this.quantity > 1) {

      this.quantity--;

    }

  }

  addToCart(): void {

  const request: AddToCartRequest = {

    productId: this.product.id,

    quantity: this.quantity

};

  this.cartService.addItem(request).subscribe({

    next: () => {

      alert("Product Added To Cart");

      this.cartService.loadCartCount();

    },

    error: err => {

      console.error(err);

      alert("Unable to add product.");

    }

  });

}

  buyNow(): void {

    console.log("Buy Now");

  }

}