import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'nevy11-testimonials',
  imports: [MatCardModule, NgOptimizedImage],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  testimonials = [
    {
      id: 1,
      avatar: '/testimonies/black_male_comp.jpeg',
      quote:
        'This platform made learning Python so easy, I built my first app in two weeks!',
      name: 'Sarah K.',
      width: 100,
      height: 93,
    },
    {
      id: 2,
      avatar: '/testimonies/female_black_comp.jpeg',
      quote:
        'The video lessons feel personal and the scripts are a great guide.',
      name: 'John M.',
      width: 100,
      height: 62,
    },
    {
      id: 3,
      avatar: '/testimonies/hidaja_female.jpeg',
      quote: 'I loved how fast I could sign up and start learning.',
      name: 'Aisha P.',
      width: 100,
      height: 66,
    },
  ];

  trackByFn(index: number, item: any): string {
    return item.name; // or a unique id if you have one
  }
}
