import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {

  name: string;

  location: string;

  review: string;

  image: string;

}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {

  testimonials: Testimonial[] = [

    {
      name: 'Ramesh Kumar',
      location: 'Hyderabad',
      review: 'The rice quality is excellent. Fresh products and timely delivery.',
      image: 'assets/images/user1.jpg'
    },

    {
      name: 'Priya Sharma',
      location: 'Bengaluru',
      review: 'Loved the turmeric. Pure quality and very reasonable prices.',
      image: 'assets/images/user2.jpg'
    },

    {
      name: 'Suresh Reddy',
      location: 'Vijayawada',
      review: 'Packaging was excellent. Will definitely order again.',
      image: 'assets/images/user3.jpg'
    }

  ];

}