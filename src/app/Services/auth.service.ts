import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) { }

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedInSubject.asObservable();
  login(request: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/Login`,
      request
    );

  }

  register(request: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/Register`,
      request, {responseType: 'text'}
    );

  }

  saveToken(token: string): void {

    localStorage.setItem("token", token);

  }

  loginSuccess(response: any): void {

    localStorage.setItem('token', response.token);
    localStorage.setItem('name', response.name);
    localStorage.setItem('role', response.role);
    localStorage.setItem('userId', response.userId.toString());

    this.loggedInSubject.next(true);
  }

  getToken(): string | null {

    return localStorage.getItem("token");

  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {

    localStorage.clear();
    this.loggedInSubject.next(false);
  }

  getUserRole(): string | null {

    return localStorage.getItem("role");

  }

  getUserName(): string {

    return localStorage.getItem('name') ?? '';

  }

}