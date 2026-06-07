import { Injectable } from '@angular/core';
import {CartItem} from '../models/cart-item';
import {PriceService} from './price.service';

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartItems: CartItem[] = [];

  constructor(private priceService: PriceService) {}

  add(product: any) {
    const existing = this.cartItems.find(i => i.product.id === product.id);

    if (existing) {
      existing.qty++;
    } else {
      this.cartItems.push({ product, qty: 1 });
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

  getItems() {
    return this.cartItems;
  }

  clear() {
    this.cartItems = [];
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + (this.priceService.getPriceForProduct(item.product.id) ?? 0) * item.qty;
    }, 0);
  }
}
