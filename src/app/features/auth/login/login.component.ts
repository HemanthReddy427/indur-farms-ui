import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'
import { AuthService } from '../../../Services/auth.service';
import { CartService } from '../../../Services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  hidePassword = true;

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private cartService: CartService,
  private router: Router, private activatedRoute: ActivatedRoute) {

    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],

      rememberMe: [false]

    });

  }

  login() {

  if (this.loginForm.invalid) {

    this.loginForm.markAllAsTouched();

    return;

  }

  const request = {

    email: this.loginForm.value.email,

    password: this.loginForm.value.password

  };

  this.authService.login(request).subscribe({

    next: (response) => {

      this.authService.loginSuccess(response);
      this.loginForm.reset();
      this.cartService.loadCartCount();
      const returnUrl =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl || '/');

    },

    error: (err) => {

      alert(err.error);

    }

  });

}
}