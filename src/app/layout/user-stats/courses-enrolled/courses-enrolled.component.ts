import { Component, inject, Input, OnInit } from '@angular/core';
import { SupabaseClientService } from '../../../supabase-client.service';
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
  private supabaseService = inject(SupabaseClientService);
  // videoThumbnails: Courses[] | null = null;
  @Input() courses: Courses[] | null = [];

  // async ngOnInit(): Promise<void> {
  //   const progressData = await this.supabaseService.getUserVideos();
  //   this.videoThumbnails = progressData;
  // }
}
