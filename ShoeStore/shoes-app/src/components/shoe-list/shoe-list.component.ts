import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../services/shoe.services';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Shoe } from '../../models/shoe.model';

@Component({
  selector: 'app-shoe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-list.component.html',
  styleUrls: ['./shoe-list.component.css']
})
export class ShoeListComponent implements OnInit {
  shoes: Shoe[] = [];
  loading = true;
  error = '';
  purchaseMessage = '';
  isCartOpen = false;
  isCheckingOut = false;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  cartService = inject(CartService);
  cartItems$ = this.cartService.getCartItems$();

  constructor(
    private shoeService: ShoeService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadShoes();
    }
  }

  loadShoes(): void {
    this.loading = true;
    this.shoeService.getAll().subscribe({
      next: (data) => { 
        this.shoes = data; 
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: () => { 
        this.error = 'Failed to load shoes.'; 
        this.loading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  get currentUser() {
    return this.authService.currentUser;
  }
  
  get cartTotal() {
    return this.cartService.currentCart.reduce((sum, item) => sum + (item.shoe.price * item.quantity), 0);
  }

  get cartCount() {
    return this.cartService.currentCart.reduce((count, item) => count + item.quantity, 0);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    this.cdr.detectChanges();
  }

  addToCart(shoe: Shoe): void {
    this.cartService.addToCart(shoe);
    this.cdr.detectChanges();
  }
  
  updateCartQuantity(shoeId: number, event: Event): void {
    const qty = parseInt((event.target as HTMLInputElement).value, 10);
    this.cartService.updateQuantity(shoeId, qty);
    this.cdr.detectChanges();
  }
  
  removeFromCart(shoeId: number): void {
    this.cartService.removeFromCart(shoeId);
    this.cdr.detectChanges();
  }

  navigateToManage(): void {
    this.router.navigate(['/manage']);
  }

  checkoutCart(): void {
    if (this.cartService.currentCart.length === 0) return;
    
    this.purchaseMessage = '';
    this.isCheckingOut = true;
    this.cdr.detectChanges();

    const request = {
      items: this.cartService.currentCart.map(i => ({ shoeId: i.shoe.id, quantity: i.quantity }))
    };

    this.orderService.purchase(request).subscribe({
      next: (res) => {
        this.purchaseMessage = `Success: ${res.message} (Total: $${res.totalAmount})`;
        
        // Decrease stock locally ONLY after successful checkout
        for (const item of this.cartService.currentCart) {
          const s = this.shoes.find(shoe => shoe.id === item.shoe.id);
          if (s) s.stockQuantity -= item.quantity;
        }
        
        this.cartService.clearCart();
        this.isCheckingOut = false;
        this.isCartOpen = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.purchaseMessage = '';
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.purchaseMessage = `Error: ${err.error?.message || err.message}`;
        this.isCheckingOut = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}