import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAdmin = false;
  isLoggedIn = false;

  userName = '';

  cartCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(value => {

      this.isLoggedIn = value;

      this.userName = this.authService.getUserName();
      this.isAdmin = value &&
                 this.authService.getUserRole() === 'Admin';
      this.cartService.cartCount$.subscribe(count => {
          this.cartCount = count;
      });
    });
  }

  logout(): void {

    this.authService.logout();
    this.cartCount = 0;
    this.cartService.clearCartCount();
    this.router.navigate(['/']);

  }

} 