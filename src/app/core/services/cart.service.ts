import {Injectable} from '@angular/core';
import {CartItem} from '../models/cart-item';
import {Product} from '../models/product';

@Injectable({providedIn: 'root'})
export class CartService {

  private cartItems: CartItem[] = [];

  constructor() {
  }

  add(product: Product) {
    const existing = this.cartItems.find(i => i.product.id === product.id);

    if (existing) {
      existing.qty++;
    } else {
      this.cartItems.push({product, qty: 1});
    }
  }

  increase(productId: string) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) item.qty++;
  }

  decrease(productId: string) {
    const item = this.cartItems.find(i => i.product.id === productId);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
      this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    }
  }

  getItems(): CartItem[] {
    return this.cartItems;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.qty, 0);
  }

  clear() {
    this.cartItems = [];
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + (item.product.price ?? 0) * item.qty;
    }, 0);
  }
}
