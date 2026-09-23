import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Observation } from '../models/observation.model';


@Injectable({ providedIn: 'root' })
export class ObservationService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = '/api/observations';

  getAll(): Observable<Observation[]> {
    return this.http.get<Observation[]>(this.baseUrl);
  }
}
