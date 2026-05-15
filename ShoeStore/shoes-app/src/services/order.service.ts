import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderRequest {
  items: { shoeId: number; quantity: number }[];
}

export interface OrderResponse {
  message: string;
  orderId: number;
  totalAmount: number;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5205/api/Orders';

  constructor(private http: HttpClient) {}

  purchase(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/purchase`, request);
  }
=======

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

>>>>>>> 012182f271a5d108f50fd57eeea7aca50aec6abf
}
