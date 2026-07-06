import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PlaceOrderResponse } from '../models/place-order-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) { }

  placeOrder(addressId:number){

    return this.http.post<PlaceOrderResponse>(

        `${this.apiUrl}/PlaceOrder/${addressId}`,

        {addressId}

    );

}

  getOrders(): Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}`

    );

  }

  getOrderItems(orderId: number): Observable<any[]> {

    return this.http.get<any[]>(

      `${this.apiUrl}/${orderId}`

    );

  }

  cancelOrder(orderId: number): Observable<string> {

    return this.http.post(

      `${this.apiUrl}/Cancel/${orderId}`,

      {},

      {

        responseType: 'text'

      }

    );

  }

}