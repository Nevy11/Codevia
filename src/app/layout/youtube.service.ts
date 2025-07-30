import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  getVideos(query: string, maxResults: number = 50): Observable<any[]> {
    const url = `${this.apiUrl}?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        res.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.high.url,
        }))
      )
    );
  }
}
