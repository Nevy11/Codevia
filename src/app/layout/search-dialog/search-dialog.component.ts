import { Component, inject } from '@angular/core';
import { YoutubeService } from '../youtube.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'nevy11-search-dialog',
  imports: [
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatCardModule
],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
})
export class SearchDialogComponent {
  query = '';
  results: any[] = [];
  youtubeService = inject(YoutubeService);
  dialogRef = inject(MatDialogRef<SearchDialogComponent>);
  search() {
    if (this.query.trim()) {
      this.youtubeService.searchVideos(this.query).subscribe((data: any) => {
        this.results = data.items;
      });
    }
  }

  selectVideo(video: any) {
    this.dialogRef.close(video.id.videoId);
  }
}
