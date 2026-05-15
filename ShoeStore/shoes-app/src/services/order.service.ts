import { Injectable } from '@angular/core';
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
}
