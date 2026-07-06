import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Address } from '../models/address.model';
import { CreateAddressRequest } from '../models/create-address-request';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = `${environment.apiUrl}/Address`;

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]> {

    return this.http.get<Address[]>(

      `${this.apiUrl}`

    );

  }

  getAddressById(id: number): Observable<Address> {

    return this.http.get<Address>(

      `${this.apiUrl}/${id}`

    );

  }

  createAddress(request: CreateAddressRequest): Observable<Address> {

    return this.http.post<Address>(

      `${this.apiUrl}/Create`,

      request

    );

  }

  updateAddress(id: number, request: CreateAddressRequest): Observable<Address> {

    return this.http.put<Address>(

      `${this.apiUrl}/${id}`,

      request

    );

  }

  deleteAddress(id: number): Observable<string> {

    return this.http.delete(

      `${this.apiUrl}/Delete/${id}`,

      {

        responseType: 'text'

      }

    );

  }

}