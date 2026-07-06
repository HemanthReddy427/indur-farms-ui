import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CartService } from '../../Services/cart.service';
import { CartItem } from '../../models/cart-items.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  freeDeliveryTarget = 499;
  remainingForFreeDelivery = 0;
  progress = 0;
  cartItemCount = 0;
  subtotal = 0;
  deliveryCharge = 0;
  tax = 0;
  grandTotal = 0;
  loading = true;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadCart();

  }

  loadCart(): void {

    this.cartService.getCart().subscribe({

      next: response => {

        this.cartItems = response;

        this.calculateTotals();

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  calculateTotals(): void {

  this.subtotal = this.cartItems.reduce(

    (sum, item) => sum + item.totalPrice,

    0

  );

  this.cartItemCount = this.cartItems.reduce(

    (sum, item) => sum + item.quantity,

    0

  );

  this.deliveryCharge = this.subtotal >= this.freeDeliveryTarget ? 0 : 50;

  this.tax = 0;

  this.grandTotal =
    this.subtotal +
    this.deliveryCharge +
    this.tax;

  this.remainingForFreeDelivery = Math.max(

    0,

    this.freeDeliveryTarget - this.subtotal

  );

  this.progress = Math.min(

    100,

    (this.subtotal / this.freeDeliveryTarget) * 100

  );

}

continueShopping(): void {

  this.router.navigate(['/products']);

}

  increase(item: CartItem): void {

    item.quantity++;

    item.totalPrice = item.price * item.quantity;

    this.updateItem(item);

  }

  decrease(item: CartItem): void {

  if (item.quantity === 1) {

    this.remove(item);

    return;

  }

  item.quantity--;

  item.totalPrice = item.price * item.quantity;

  this.updateItem(item);

}

  updateItem(item: CartItem): void {

    this.cartService.updateItem(item).subscribe({

      next: () => {

        this.calculateTotals();

        this.cartService.loadCartCount();

      },

      error: err => console.error(err)

    });

  }

  remove(item: CartItem): void {

    if (!confirm('Remove this product from cart?')) {

      return;

    }

    this.cartService.deleteItem(item.id).subscribe({

      next: () => {

        this.cartItems = this.cartItems.filter(x => x.id !== item.id);

        this.calculateTotals();

        this.cartService.loadCartCount();

      },

      error: err => console.error(err)

    });

  }

  checkout(): void {

    this.router.navigate(['/checkout']);

  }

}