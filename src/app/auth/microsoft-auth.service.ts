import { Injectable, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError
} from '@azure/msal-browser';
import { AuthService } from '../Services/auth.service';
import { CartService } from '../Services/cart.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MicrosoftAuthService {
  private msal = inject(MsalService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  /** True only right after returning from a Microsoft login redirect. */
  justLoggedIn = false;

  /** Microsoft account if signed in, otherwise null. Safe to call before MSAL is initialized. */
  getAccount(): AccountInfo | null {
    try {
      return (
        this.msal.instance.getActiveAccount() ??
        this.msal.instance.getAllAccounts()[0] ??
        null
      );
    } catch {
      return null;
    }
  }

  isMicrosoftUser(): boolean {
    return this.getAccount() !== null;
  }

  login(): void {
    this.msal.loginRedirect({ scopes: environment.API_SCOPES });
  }

  /** Runs at app startup (APP_INITIALIZER), before the router and guards. */
  async init(): Promise<boolean> {
    await this.msal.instance.initialize();

    try {
      const result = await this.msal.instance.handleRedirectPromise();
      if (result?.account) {
        this.msal.instance.setActiveAccount(result.account);
        this.syncUser(result.account, result);
        this.justLoggedIn = true;
        return true;
      }
    } catch (err) {
      console.error('MSAL redirect error:', err);
      return false;
    }

    const account = this.getAccount();
    if (account) {
      this.msal.instance.setActiveAccount(account);
      await this.restoreSession(account);
    }
    return false;
  }

  /** Signs out of your app and, for Microsoft users, Microsoft too. */
  logout(): void {
    const account = this.getAccount();
    this.authService.logout();

    if (account) {
      this.msal.logoutRedirect({
        account,
        postLogoutRedirectUri: window.location.origin
      });
    }
  }

  /** Removes a cached Microsoft account without redirecting (used before local login). */
  async clearMicrosoftSession(): Promise<void> {
    try {
      await this.msal.instance.clearCache();
      this.msal.instance.setActiveAccount(null);
    } catch {
      /* MSAL not initialized, nothing to clear */
    }
  }

  // ---------- private ----------

  private async restoreSession(account: AccountInfo): Promise<void> {
    try {
      const result = await this.msal.instance.acquireTokenSilent({
        scopes: environment.API_SCOPES,
        account
      });
      this.syncUser(account, result);
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        // Session expired: quietly sign out locally instead of forcing a redirect.
        await this.clearMicrosoftSession();
        this.authService.logout();
      } else {
        console.error('Silent token error:', err);
      }
    }
  }

  private syncUser(account: AccountInfo, result: AuthenticationResult): void {
    this.authService.loginSuccess({
      token: result.accessToken,
      email: account.username,
      name: account.name || account.username
    });
    this.cartService.loadCartCount();
  }
}