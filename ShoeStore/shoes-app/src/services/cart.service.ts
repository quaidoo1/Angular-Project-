<<<<<<< HEAD
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shoe } from '../models/shoe.model';

export interface CartItem {
  shoe: Shoe;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  get currentCart(): CartItem[] {
    return this.cartItems.value;
  }

  addToCart(shoe: Shoe): void {
    const items = [...this.currentCart];
    const existing = items.find(i => i.shoe.id === shoe.id);
    
    if (existing) {
      if (existing.quantity < shoe.stockQuantity) {
        existing.quantity++;
      }
    } else {
      if (shoe.stockQuantity > 0) {
        items.push({ shoe, quantity: 1 });
      }
    }
    this.cartItems.next(items);
  }

  removeFromCart(shoeId: number): void {
    const items = this.currentCart.filter(i => i.shoe.id !== shoeId);
    this.cartItems.next(items);
  }

  updateQuantity(shoeId: number, quantity: number): void {
    const items = [...this.currentCart];
    const item = items.find(i => i.shoe.id === shoeId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(shoeId);
        return;
      }
      if (quantity <= item.shoe.stockQuantity) {
        item.quantity = quantity;
      }
    }
    this.cartItems.next(items);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
=======
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

>>>>>>> 012182f271a5d108f50fd57eeea7aca50aec6abf
}
