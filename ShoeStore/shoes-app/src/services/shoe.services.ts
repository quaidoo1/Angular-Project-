import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shoe } from '../models/shoe.model';

@Injectable({ providedIn: 'root' })
export class ShoeService {
  private apiUrl = 'http://10.87.72.90:5205/api/Shoes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Shoe[]> {
    return this.http.get<Shoe[]>(this.apiUrl);
  }

  getById(id: number): Observable<Shoe> {
    return this.http.get<Shoe>(`${this.apiUrl}/${id}`);
  }

  create(shoe: Omit<Shoe, 'id'>): Observable<Shoe> {
    return this.http.post<Shoe>(this.apiUrl, shoe);
  }

  update(id: number, shoe: Shoe): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, shoe);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
