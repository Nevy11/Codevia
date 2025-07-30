import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';
  private apiKey = environment.youtubeApiKey;

  private http = inject(HttpClient);

  searchVideos(query: string) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        part: 'snippet',
        q: query,
        key: this.apiKey,
        maxResults: 50,
        type: 'video',
      },
    });
  }
}
