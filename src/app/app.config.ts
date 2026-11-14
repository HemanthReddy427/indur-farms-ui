import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration
} from '@azure/msal-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthRouterInterceptor } from './auth/auth-router.interceptor';
import { MicrosoftAuthService } from './auth/microsoft-auth.service';

export function MSALInstanceFactory(): IPublicClientApplication {
  const tenantId = 'fd11de42-c60e-4d74-bfc1-e6e4789a5630';

  return new PublicClientApplication({
    auth: {
      clientId: '590a8c57-57c7-448a-a5e5-72cd482f134c',
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.apiUrl + '/*', environment.API_SCOPES);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.API_SCOPES
    }
  };
}

// Runs before the first route activates, so guards see the Microsoft user's token.
export function initAuth(microsoftAuth: MicrosoftAuthService) {
  return () => microsoftAuth.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    MsalInterceptor, // plain provider; AuthRouterInterceptor delegates to it
    { provide: HTTP_INTERCEPTORS, useClass: AuthRouterInterceptor, multi: true },

    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,

    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [MicrosoftAuthService], multi: true }
  ]
};