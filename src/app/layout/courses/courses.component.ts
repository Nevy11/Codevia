import { Component } from '@angular/core';
import { CourseListComponent } from './course-list/course-list.component';

@Component({
  selector: 'nevy11-courses',
  imports: [CourseListComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {}
