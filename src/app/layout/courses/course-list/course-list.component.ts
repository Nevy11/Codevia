import { Component, OnInit } from '@angular/core';
import { Course } from '../../course';
import { CoursesCardComponent } from '../courses-card/courses-card.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'nevy11-course-list',
  imports: [CoursesCardComponent, CommonModule, MatGridListModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  ngOnInit(): void {
    // Mock data for demonstration purposes
    this.courses = [
      {
        id: 1,
        title: 'Intro to Python',
        description: 'Learn Python basics and start building apps.',
        image: '/courses/python.png',
        level: 'Beginner',
      },
      {
        id: 2,
        title: 'Advanced php',
        description: 'Deep dive into advanced php features.',
        image: '/courses/php.jpeg',
        level: 'Advanced',
      },
      {
        id: 3,
        title: 'Advanced js',
        description: 'Deep dive into advanced js features.',
        image: '/courses/js.jpeg',
        level: 'Intermediate',
      },
      {
        id: 4,
        title: 'Advanced java',
        description: 'Deep dive into advanced java features.',
        image: '/courses/java.jpeg',
        level: 'Beginner',
      },
    ];
  }
}
