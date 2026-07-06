import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { AddressService } from '../../../Services/address.service';
import { Address } from '../../../models/address.model';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent implements OnInit {

  addresses: Address[] = [];

  loading = true;

  constructor(
    private addressService: AddressService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadAddresses();

  }

  loadAddresses(): void {

    this.addressService.getAddresses().subscribe({

      next: response => {

        this.addresses = response;

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  addAddress(): void {

    this.router.navigate(['/addresses/add']);

  }

  editAddress(id: number): void {

    this.router.navigate(['/addresses/edit', id]);

  }

  deleteAddress(id: number): void {

    if (!confirm('Delete this address?')) {

      return;

    }

    this.addressService.deleteAddress(id).subscribe({

      next: () => {

        this.addresses = this.addresses.filter(x => x.id !== id);

      },

      error: err => console.error(err)

    });

  }

}