import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { AddressService } from '../../../Services/address.service';
import { CreateAddressRequest } from '../../../models/create-address-request';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.scss'
})
export class EditAddressComponent implements OnInit {

  id = 0;

  address: CreateAddressRequest = {

    basicAddress: '',

    landmark: '',

    city: '',

    district: '',

    state: '',

    zipCode: ''

  };

  loading = true;

  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadAddress();

  }

  loadAddress(): void {

    this.addressService.getAddressById(this.id).subscribe({

      next: response => {

        this.address = {

          basicAddress: response.basicAddress,

          landmark: response.landmark,

          city: response.city,

          district: response.district,

          state: response.state,

          zipCode: response.zipCode

        };

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  updateAddress(): void {

    this.saving = true;

    this.addressService.updateAddress(this.id, this.address).subscribe({

      next: () => {

        alert('Address Updated Successfully');

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