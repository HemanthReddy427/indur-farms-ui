import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddToCartRequest } from '../models/add-to-cart-request.model';
import { CartItem } from '../models/cart-items.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/Cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartItem[]> {

    return this.http.get<CartItem[]>(
      `${this.apiUrl}/GetAllItems`
    );

  }

  addItem(request: AddToCartRequest): Observable<CartItem> {

    return this.http.post<CartItem>(
      `${this.apiUrl}/AddItem`,
      request
    );

  }

  updateItem(cartItem: CartItem): Observable<CartItem> {

    return this.http.put<CartItem>(
      `${this.apiUrl}/UpdateItem`,
      cartItem
    );

  }

  deleteItem(cartItemId: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${cartItemId}`,
      {
        responseType: 'text'
      }
    );

  }

  loadCartCount(): void {

    this.getCart().subscribe({

      next: (items) => {

        const count = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        this.cartCountSubject.next(count);

      },

      error: () => {

        this.cartCountSubject.next(0);

      }

    });

  }

  clearCartCount(): void {

    this.cartCountSubject.next(0);

  }

}