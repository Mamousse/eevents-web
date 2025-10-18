import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  url: string;
  filename: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'eevents-api-production.up.railway.app/upload';

  constructor(private http: HttpClient) { }

  // Upload d'un seul fichier
  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }

  // Upload de plusieurs fichiers
  uploadMultipleFiles(files: File[]): Observable<UploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<UploadResponse[]>(`${this.apiUrl}/multiple`, formData);
  }
}
