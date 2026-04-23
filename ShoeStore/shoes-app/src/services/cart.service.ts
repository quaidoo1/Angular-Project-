import { Injectable, signal, computed } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })

export class CartService {

  private apiUrl = 'http://localhost:5205/api/cart';

  // Generate a session ID for this browser session

  private sessionId = localStorage.getItem('cartSessionId') || this.generateSessionId();

  // Reactive cart state

  private _cart = signal<Cart | null>(null);

  cart = this._cart.asReadonly();

  cartCount = computed(() =>

    this._cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  );

  cartTotal = computed(() =>

    this._cart()?.items.reduce((sum, item) => sum + item.shoe.price * item.quantity, 0) ?? 0

  );

  constructor(private http: HttpClient) {

    localStorage.setItem('cartSessionId', this.sessionId);

    this.loadCart();

  }

  getSessionId() { return this.sessionId; }

  loadCart(): void {

    this.http.get<Cart>('${this.apiUrl}/${this.sessionId}').subscribe({

      next: (cart) => this._cart.set(cart),

      error: () => this._cart.set(null) // cart doesn't exist yet, that's fine

    });

  }

  addToCart(shoeId: number, quantity = 1): Observable<Cart> {

    return this.http.post<Cart>(
'${this.apiUrl}/${this.sessionId}/add',

      { shoeId, quantity }

    ).pipe(tap(cart => this._cart.set(cart)));

  }

  updateQuantity(cartItemId: number, quantity: number): Observable<void> {

    return this.http.put<void>(
'${this.apiUrl}/${this.sessionId}/update/${cartItemId}',

      { quantity }

    ).pipe(tap(() => this.loadCart()));

  }

  removeItem(cartItemId: number): Observable<void> {

    return this.http.delete<void>(
'${this.apiUrl}/${this.sessionId}/remove/${cartItemId}'

    ).pipe(tap(() => this.loadCart()));

  }

  clearCart(): Observable<void> {

    return this.http.delete<void>(
'${this.apiUrl}/${this.sessionId}/clear'

    ).pipe(tap(() => this._cart.set(null)));

  }

  private generateSessionId(): string {

    return 'sess_' + Math.random().toString(36).substring(2, 15);

  }

}
