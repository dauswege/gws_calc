import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { OrderService } from './order.service';

@Injectable({providedIn: 'root'})
export class CartService {
  constructor(private readonly orderService: OrderService) {}

  activeOrderChanges(): Observable<Order | null> {
    return this.orderService.activeOrderChanges();
  }

  getActiveOrder(): Order | null {
    return this.orderService.getActiveOrder();
  }

  itemsChanges(): Observable<CartItem[]> {
    return this.orderService.activeOrderChanges().pipe(
      map(order => order?.items ?? []),
    );
  }

  totalQuantityChanges(): Observable<number> {
    return this.itemsChanges().pipe(
      map(items => items.reduce((sum, item) => sum + item.qty, 0)),
    );
  }

  totalChanges(): Observable<number> {
    return this.itemsChanges().pipe(
      map(items => items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.qty, 0)),
    );
  }

  add(product: Product) {
    this.orderService.addProduct(product);
  }

  increase(productId: string) {
    this.orderService.increase(productId);
  }

  decrease(productId: string) {
    this.orderService.decrease(productId);
  }

  getItems(): CartItem[] {
    return this.orderService.getActiveItems();
  }

  getTotalQuantity(): number {
    return this.orderService.getActiveTotalQuantity();
  }

  clear() {
    this.orderService.clearActiveOrder();
  }

  getTotal(): number {
    return this.orderService.getActiveTotal();
  }

  setCheckoutTotalOverride(amount: number | null): boolean {
    return this.orderService.setActiveCheckoutTotalOverride(amount);
  }

  setReceivedAmount(amount: number | null): boolean {
    return this.orderService.setActiveReceivedAmount(amount);
  }
}
