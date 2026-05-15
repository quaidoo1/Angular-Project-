import { Shoe } from './shoe.model';
export interface CartItem {
 id: number;
 cartId: number;
 shoeId: number;
 shoe: Shoe;
 quantity: number;
}
export interface Cart {
 id: number;
 sessionId: string;
 createdAt: string;
 items: CartItem[];
}
