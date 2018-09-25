import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }

  // Returns an observable describing the post request.
  upload(formData) {
    return this.http.post<any>('http://localhost:3000/upload', formData);
  }
}
