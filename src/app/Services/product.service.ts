import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(this.apiUrl);

  }

  getProductById(id: number): Observable<Product> {

    return this.http.get<Product>(`${this.apiUrl}/${id}`);

  }

  addProduct(formData: FormData): Observable<any> {

    return this.http.post(
    `${this.apiUrl}/Add`,
    formData,
    {
      responseType: 'text'
    }
  );
  }

  updateProduct(id: number, product: any): Observable<any> {

    return this.http.put(`${this.apiUrl}/${id}`, product);

  }

  deleteProduct(id: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${id}`);

  }

}