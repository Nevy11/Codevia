import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GithubTriggerService {
  constructor(private http: HttpClient) {}
  private anon_key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZXlzbnF4em16bGZiemZqaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjU5MzMsImV4cCI6MjA2OTU0MTkzM30.dG4lwMFKtTpklmOu_tZeFrRZy-vvYhdjwsO2zz2yaNE';
  private url =
    'https://xzeysnqxzmzlfbzfjhys.supabase.co/functions/v1/trigger-github';
  triggerGithub(data: any) {
    return this.http.post(
      `${this.url}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${this.anon_key}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
// endpoint
// https://xzeysnqxzmzlfbzfjhys.supabase.co/functions/v1/trigger-github
