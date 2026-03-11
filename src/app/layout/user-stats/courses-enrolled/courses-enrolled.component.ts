import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Courses } from '../courses';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nevy11-courses-enrolled',
  imports: [MatCardModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './courses-enrolled.component.html',
  styleUrl: './courses-enrolled.component.scss',
})
export class CoursesEnrolledComponent  {
  @Input() courses: Courses[] | null = [];
}
