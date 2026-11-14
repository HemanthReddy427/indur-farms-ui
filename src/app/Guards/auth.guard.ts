import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { MicrosoftAuthService } from '../auth/microsoft-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const microsoftAuth = inject(MicrosoftAuthService);
  const router = inject(Router);

  if (authService.getToken() || microsoftAuth.isMicrosoftUser()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};