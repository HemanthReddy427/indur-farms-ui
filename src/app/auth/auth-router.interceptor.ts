import { Injectable, inject } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { MsalInterceptor } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { environment } from '../../environments/environment';

/**
 * Chooses the auth mechanism per API request:
 *  - Microsoft user -> MsalInterceptor (token + silent renewal)
 *  - Local user     -> attach the locally issued JWT
 */
@Injectable()
export class AuthRouterInterceptor implements HttpInterceptor {
  private msalInterceptor = inject(MsalInterceptor);
  private microsoftAuth = inject(MicrosoftAuthService);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.apiUrl + '/')) {
      return next.handle(req);
    }

    if (this.microsoftAuth.isMicrosoftUser()) {
      return this.msalInterceptor.intercept(req, next);
    }

    const token = this.authService.getToken();
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;
    return next.handle(authReq);
  }
}