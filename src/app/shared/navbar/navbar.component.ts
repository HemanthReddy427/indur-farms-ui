import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { MicrosoftAuthService } from '../../auth/microsoft-auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isLoggedIn = false;
  userName = '';
  cartCount = 0;

  private localLoggedIn = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private microsoftAuth: MicrosoftAuthService,
    private msalBroadcast: MsalBroadcastService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.localLoggedIn = value;
        this.refresh();
      });

    this.msalBroadcast.inProgress$
      .pipe(
        filter(status => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.refresh());

    this.msalBroadcast.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS ||
          msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          msg.eventType === EventType.ACTIVE_ACCOUNT_CHANGED ||
          msg.eventType === EventType.LOGOUT_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.refresh());

    this.cartService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.cartCount = count);

    this.refresh();
  }

  private refresh(): void {
    const msAccount = this.microsoftAuth.getAccount();

    this.isLoggedIn = this.localLoggedIn || !!msAccount;
    this.userName =
      this.authService.getUserName() ||
      msAccount?.name ||
      msAccount?.username ||
      '';
    this.isAdmin = this.localLoggedIn && this.authService.getUserRole() === 'Admin';
  }

  logout(): void {
    this.microsoftAuth.logout();
    this.cartCount = 0;
    this.cartService.clearCartCount();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}