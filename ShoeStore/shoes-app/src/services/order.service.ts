import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Order, PlaceOrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })

export class OrderService {

  private apiUrl = 'http://localhost:5205/api/order';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {

    return this.http.get<Order[]>(this.apiUrl);

  }

  getById(id: number): Observable<Order> {

    return this.http.get<Order>('${this.apiUrl}/${id}');

  }

  placeOrder(sessionId: string, request: PlaceOrderRequest): Observable<Order> {

    return this.http.post<Order>('${this.apiUrl}/place/${sessionId}', request);

  }

}
