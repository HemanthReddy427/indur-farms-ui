import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { AddressService } from '../../../Services/address.service';
import { CreateAddressRequest } from '../../../models/create-address-request';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss'
})
export class AddAddressComponent {

  address: CreateAddressRequest = {

    basicAddress: '',

    landmark: '',

    city: '',

    district: '',

    state: '',

    zipCode: ''

  };

  saving = false;

  constructor(
    private addressService: AddressService,
    private router: Router
  ) { }

  saveAddress(): void {

    this.saving = true;

    this.addressService.createAddress(this.address).subscribe({

      next: () => {

        alert('Address Added Successfully');

        this.router.navigate(['/addresses']);

      },

      error: err => {

        console.error(err);

        this.saving = false;

      }

    });

  }

  cancel(): void {

    this.router.navigate(['/addresses']);

  }

}