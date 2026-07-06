import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../Services/auth.service';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  hidePassword = true;
  hideConfirmPassword = true;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group(
      {

        name: ['', Validators.required],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[6-9][0-9]{9}$')
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ]

      },
      {
        validators: passwordMatchValidator
      }
    );

  }

  register() {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();
      return;

    }

    const request = {

      name: this.registerForm.value.name,

      email: this.registerForm.value.email,

      phone: this.registerForm.value.phone,

      password: this.registerForm.value.password

    };

    this.authService.register(request).subscribe({
      next: (response) => {
        alert(response);
        this.registerForm.reset();
        this.router.navigate(['/login']);
},

      error: (err) => {

        alert(err.error);

      }

    });

  }

}