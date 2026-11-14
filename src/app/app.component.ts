import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { MicrosoftAuthService } from './auth/microsoft-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private broadcast = inject(MsalBroadcastService);
  private authService = inject(AuthService);
  private microsoftAuth = inject(MicrosoftAuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // MSAL returns the user to the page where login started (/login).
    // After a fresh Microsoft login, move on to the home page.
    if (this.microsoftAuth.justLoggedIn) {
      this.microsoftAuth.justLoggedIn = false;
      this.router.navigateByUrl('/');
    }

    // Logout in another tab (or from Microsoft) -> clear local state here too.
    this.broadcast.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.authService.logout());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}