import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VerifyPaymentRequest } from '../models/verify-payment-request.model';
import { PlaceOrderResponse } from '../models/place-order-response.model';
import { CreatePaymentOrderRequest } from '../models/create-payment-order-request.model';
import { RazorpayOrderResponse } from '../models/razorpay-order-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.apiUrl}/Payment`;

  constructor(private http: HttpClient) { }

  createOrder(request: CreatePaymentOrderRequest): Observable<RazorpayOrderResponse> {

    return this.http.post<RazorpayOrderResponse>(
      `${this.apiUrl}/CreateOrder`,
      request
    );

  }

  verifyPayment(request: VerifyPaymentRequest): Observable<PlaceOrderResponse> {

    return this.http.post<PlaceOrderResponse>(
      `${this.apiUrl}/Verify`,
      request
    );

  }

}