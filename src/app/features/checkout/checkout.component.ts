import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

import { CartService } from '../../Services/cart.service';
import { AddressService } from '../../Services/address.service';
import { Address } from '../../models/address.model';
import { CartItem } from '../../models/cart-items.model';
import { OrdersService } from '../../Services/orders.service';
import { PaymentMethod } from '../../models/payment-method.model';
import { PaymentService } from '../../Services/payment.service';
import { RazorpayOrderResponse } from '../../models/razorpay-order-response.model';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];

  addresses: Address[] = [];

  selectedAddressId = 0;

  subtotal = 0;

  delivery = 0;

  tax = 0;

  grandTotal = 0;

  totalItems = 0;

  loading = true;

  PaymentMethod = PaymentMethod;

selectedPaymentMethod: PaymentMethod =
  PaymentMethod.CashOnDelivery;

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private router: Router,
    private ordersService: OrdersService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {

    this.loadCheckout();

  }

  loadCheckout(): void {

    this.cartService.getCart().subscribe({

      next: cart => {

        this.cartItems = cart;

        this.calculateTotals();

      }

    });

    this.addressService.getAddresses().subscribe({

      next: response => {

        this.addresses = response;

        if (response.length > 0) {

          this.selectedAddressId = response[0].id;

        }

        this.loading = false;

      }

    });

  }

  calculateTotals(): void {

    this.subtotal = this.cartItems.reduce(

      (sum, item) => sum + item.totalPrice,

      0

    );

    this.totalItems = this.cartItems.reduce(

      (sum, item) => sum + item.quantity,

      0

    );

    this.delivery = this.subtotal >= 499 ? 0 : 50;

    this.tax = 0;

    this.grandTotal =
      this.subtotal +
      this.delivery +
      this.tax;

  }

  manageAddresses(): void {

    this.router.navigate(['/addresses']);

  }

  placeOrder(): void {

  if (this.selectedAddressId === 0) {

    alert("Please select an address.");

    return;

  }

  if (this.selectedPaymentMethod === PaymentMethod.CashOnDelivery) {

    this.placeCodOrder();

  }
  else {

    this.startRazorpayPayment();

  }

}
  private placeCodOrder(): void {

  this.ordersService.placeOrder(this.selectedAddressId).subscribe({

    next: response => {

      this.cartService.clearCartCount();

      this.router.navigate(
        ['/order-success', response.orderId],
        {
          state: {
            order: response
          }
        });

    },

    error: err => {

      console.error(err);

      alert(err.error);

    }

  });

}

  private startRazorpayPayment(): void {

  this.paymentService.createOrder({

    addressId: this.selectedAddressId

  }).subscribe({

    next: response => {

      this.openRazorpay(response);

    },

    error: err => {

      console.error(err);

      alert(err.error);

    }

  });

}
  private openRazorpay(order: RazorpayOrderResponse): void {

  const options = {

    key: order.key,

    currency: order.currency,

    name: 'Indur Farms',

    description: 'Order Payment',

    order_id: order.orderId,

    handler: (response: any) => {

      console.log(response);

      alert('Payment Successful');

    },

    theme: {

      color: '#2E7D32'

    }

  };

  const razorpay = new Razorpay(options);

  razorpay.open();

}
}