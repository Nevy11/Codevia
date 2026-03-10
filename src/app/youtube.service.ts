import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

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
      query,
    )}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((res) =>
        res.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.high.url,
        })),
      ),
    );
  }
  // youtube.service.ts
  getDiscoverProgrammingVideos(maxResults: number = 50): Observable<any[]> {
    const queries = ['programming tutorials', 'web development course', 'computer science basics', 'coding projects'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    return this.getVideos(randomQuery, maxResults).pipe(
      map(videos => videos.sort(() => Math.random() - 0.5)) // Shuffle for randomness
    );
  }
}
