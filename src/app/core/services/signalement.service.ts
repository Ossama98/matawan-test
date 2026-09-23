import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signalement, SignalementPayload } from '../models/signalement.model';

@Injectable({ providedIn: 'root' })
export class SignalementService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/reporting';

  getAll(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(this.baseUrl);
  }

  getById(id: number): Observable<Signalement> {
    return this.http.get<Signalement>(`${this.baseUrl}/${id}`);
  }

  create(payload: SignalementPayload): Observable<void> {
    return this.http.post<void>(this.baseUrl, payload);
  }

  update(id: number, payload: SignalementPayload): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }
}
