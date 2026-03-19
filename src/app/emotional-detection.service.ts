import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmotionalDetectionService {
  // Replace with your FastAPI server URL
  private readonly apiUrl = 'http://127.0.0.1:8000/predict-emotion';

  constructor(private http: HttpClient) {}

  /**
   * @param imageBlob
   */
  detectEmotion(imageBlob: Blob): Observable<any> {
    const formData = new FormData();

    // The first argument 'file' MUST match the parameter name
    // in your FastAPI function: (file: UploadFile = File(...))
    formData.append('file', imageBlob, 'capture.jpg');

    return this.http.post(this.apiUrl, formData);
  }
}
