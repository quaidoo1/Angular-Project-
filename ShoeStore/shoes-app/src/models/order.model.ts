export enum OrderStatus {

  Pending = 0,

  Confirmed = 1,

  Shipped = 2,

  Delivered = 3,

  Cancelled = 4

}

export interface OrderItem {

  id: number;

  orderId: number;

  shoeId: number;

  shoe: { name: string; brand: string; imageUrl: string };

  quantity: number;

  unitPrice: number;

}

export interface Order {

  id: number;

  customerName: string;

  customerEmail: string;

  orderedAt: string;

  status: OrderStatus;

  totalAmount: number;

  items: OrderItem[];

}

export interface PlaceOrderRequest {

  customerName: string;

  customerEmail: string;

}
 