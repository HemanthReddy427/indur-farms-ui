import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {

  icon: string;

  title: string;

  description: string;

}

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-us.component.html',
  styleUrl: './why-us.component.scss'
})
export class WhyUsComponent {

  features: Feature[] = [

    {
      icon: '🌿',
      title: '100% Organic',
      description: 'Naturally grown products without harmful chemicals.'
    },

    {
      icon: '🚜',
      title: 'Direct From Farmers',
      description: 'We source products directly from trusted farmers.'
    },

    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep.'
    },

    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Safe and secure payment options for every order.'
    }

  ];

}