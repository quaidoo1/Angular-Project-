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
      existing.quantity++;
    } else {
      items.push({ shoe, quantity: 1 });
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
      item.quantity = quantity;
    }
    this.cartItems.next(items);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}
