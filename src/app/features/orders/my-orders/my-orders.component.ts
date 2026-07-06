import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { OrdersService } from '../../../Services/orders.service';
import { PlaceOrderResponse } from '../../../models/place-order-response.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {

  orders: PlaceOrderResponse[] = [];

  loading = true;

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadOrders();

  }

  loadOrders(): void {

    this.ordersService.getOrders().subscribe({

      next: response => {

        this.orders = response;

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  viewOrder(orderId: number): void {

    this.router.navigate(['/orders', orderId]);

  }

  cancelOrder(orderId: number): void {

    if (!confirm("Cancel this order?")) {

      return;

    }

    this.ordersService.cancelOrder(orderId).subscribe({

      next: () => {

        const order = this.orders.find(x => x.orderId === orderId);

        if (order) {

          order.orderStatus = "Cancelled";

        }

      },

      error: err => console.error(err)

    });

  }

  canCancel(order: PlaceOrderResponse): boolean {

    return order.orderStatus === 'Pending'
        || order.orderStatus === 'Confirmed';

  }

  getOrderStatusClass(status: string): string {

  switch (status.toLowerCase()) {

    case 'pending':
      return 'pending';

    case 'confirmed':
      return 'confirmed';

    case 'packed':
      return 'packed';

    case 'shipped':
      return 'shipped';

    case 'delivered':
      return 'delivered';

    case 'cancelled':
      return 'cancelled';

    default:
      return '';

  }

}

getPaymentStatusClass(status: string): string {

  switch (status.toLowerCase()) {

    case 'pending':
      return 'payment-pending';

    case 'paid':
      return 'paid';

    case 'failed':
      return 'failed';

    default:
      return '';

  }

}

}