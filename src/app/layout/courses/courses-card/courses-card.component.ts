import { Component, Input } from '@angular/core';
import { Course } from '../../course';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'nevy11-courses-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './courses-card.component.html',
  styleUrl: './courses-card.component.scss',
})
export class CoursesCardComponent {
  @Input() course!: Course;
}
