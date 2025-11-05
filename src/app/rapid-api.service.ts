import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapidApiService {
  private url = 'https://judge0-ce.p.rapidapi.com/about';

  private headers = new HttpHeaders({
    'x-rapidapi-key': 'f5878b00camsh889c64ea4495833p114649jsn6c414fa3cef7',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  });

  constructor(private http: HttpClient) {}

  async getInfo(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get(this.url, { headers: this.headers })
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
