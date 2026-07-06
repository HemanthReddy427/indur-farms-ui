import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { PlaceOrderResponse } from '../../../models/place-order-response.model';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent implements OnInit {

  order?: PlaceOrderResponse;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.order = history.state.order;

    if (!this.order) {

      this.router.navigate(['/']);

    }

  }

}