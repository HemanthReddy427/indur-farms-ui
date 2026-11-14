import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { CartService } from '../../../Services/cart.service';
import { MicrosoftAuthService } from '../../../auth/microsoft-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private microsoftAuth: MicrosoftAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Already signed in (local or Microsoft)? Leave the login page.
    if (this.authService.getToken() || this.microsoftAuth.isMicrosoftUser()) {
      const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
      this.router.navigateByUrl(returnUrl || '/');
    }
  }

  loginWithMicrosoft(): void {
    this.microsoftAuth.login();
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Remove any leftover Microsoft account so the interceptor uses the local JWT path.
    await this.microsoftAuth.clearMicrosoftSession();

    const request = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.authService.loginSuccess(response);
        this.loginForm.reset();
        this.cartService.loadCartCount();
        const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/');
      },
      error: (err) => {
        alert(err.error);
      }
    });
  }
}