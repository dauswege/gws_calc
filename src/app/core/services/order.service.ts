import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { CreateOrderInput, Order, OrdersStorageV1 } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly STORAGE_KEY = 'gws_calc.orders.v1';
  private readonly stateSubject = new BehaviorSubject<OrdersStorageV1>(this.loadState());

  ordersChanges(): Observable<Order[]> {
    return this.stateSubject.asObservable().pipe(map(state => state.orders));
  }

  activeOrderChanges(): Observable<Order | null> {
    return this.stateSubject.asObservable().pipe(map(state => this.getActiveOrderFromState(state)));
  }

  getOrders(): Order[] {
    return this.cloneOrders(this.stateSubject.value.orders);
  }

  getActiveOrder(): Order | null {
    return this.getActiveOrderFromState(this.stateSubject.value);
  }

  getActiveItems(): CartItem[] {
    return this.getActiveOrder()?.items ?? [];
  }

  getOrderItems(orderId: string): CartItem[] {
    return this.getOrderById(orderId)?.items ?? [];
  }

  getActiveTotalQuantity(): number {
    return this.getActiveItems().reduce((sum, item) => sum + item.qty, 0);
  }

  getOrderTotalQuantity(orderId: string): number {
    return this.getOrderItems(orderId).reduce((sum, item) => sum + item.qty, 0);
  }

  getActiveTotal(): number {
    return this.getOrderTotal(this.stateSubject.value.activeOrderId);
  }

  getOrderTotal(orderId: string | null): number {
    if (!orderId) {
      return 0;
    }

    return this.getOrderItems(orderId).reduce((sum, item) => {
      return sum + (item.product.price ?? 0) * item.qty;
    }, 0);
  }

  createOrder(input: CreateOrderInput = {}): Order {
    const now = this.now();
    const order: Order = {
      id: this.createId(),
      label: this.buildLabel(input),
      kind: input.kind ?? 'table',
      items: this.cloneItems(input.items ?? []),
      createdAt: now,
      updatedAt: now,
      notes: input.notes?.trim() || undefined,
    };

    this.patchState(state => ({
      ...state,
      orders: [...state.orders, order],
      activeOrderId: input.activate === false ? state.activeOrderId : order.id,
    }));

    return order;
  }

  setActiveOrder(orderId: string): boolean {
    return this.patchState(state => {
      if (!state.orders.some(order => order.id === orderId)) {
        return state;
      }

      return { ...state, activeOrderId: orderId };
    });
  }

  switchToOrder(orderId: string): boolean {
    return this.setActiveOrder(orderId);
  }

  renameOrder(orderId: string, label: string): boolean {
    const nextLabel = label.trim();

    if (!nextLabel) {
      return false;
    }

    return this.updateOrder(orderId, order => ({
      ...order,
      label: nextLabel,
    }));
  }

  setActiveCheckoutTotalOverride(amount: number | null): boolean {
    return this.updateActiveOrder(order => ({
      ...order,
      checkoutTotalOverride: this.normalizeMoneyValue(amount),
      updatedAt: this.now(),
    }));
  }

  setActiveReceivedAmount(amount: number | null): boolean {
    return this.updateActiveOrder(order => ({
      ...order,
      receivedAmount: this.normalizeMoneyValue(amount),
      updatedAt: this.now(),
    }));
  }

  deleteOrder(orderId: string): boolean {
    return this.patchState(state => {
      const exists = state.orders.some(order => order.id === orderId);
      if (!exists) {
        return state;
      }

      const remaining = state.orders.filter(order => order.id !== orderId);
      const nextState = {
        ...state,
        orders: remaining,
        activeOrderId: state.activeOrderId === orderId ? remaining[0]?.id ?? null : state.activeOrderId,
      };

      return this.ensureActiveOrder(nextState);
    });
  }

  addProduct(product: Product, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    this.updateActiveOrder(order => {
      const existing = order.items.find(item => item.product.id === product.id);

      if (existing) {
        return {
          ...order,
          items: order.items.map(item =>
            item.product.id === product.id
              ? { ...item, qty: item.qty + quantity }
              : item,
          ),
          checkoutTotalOverride: undefined,
          receivedAmount: undefined,
          updatedAt: this.now(),
        };
      }

      return {
        ...order,
        items: [...order.items, { product, qty: quantity }],
        checkoutTotalOverride: undefined,
        receivedAmount: undefined,
        updatedAt: this.now(),
      };
    });
  }

  increase(productId: string): void {
    this.updateActiveOrder(order => ({
      ...order,
      items: order.items.map(item =>
        item.product.id === productId
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
      checkoutTotalOverride: undefined,
      receivedAmount: undefined,
      updatedAt: this.now(),
    }));
  }

  decrease(productId: string): void {
    this.updateActiveOrder(order => {
      const updatedItems = order.items
        .map(item => item.product.id === productId ? { ...item, qty: item.qty - 1 } : item)
        .filter(item => item.qty > 0);

      return {
        ...order,
        items: updatedItems,
        checkoutTotalOverride: undefined,
        receivedAmount: undefined,
        updatedAt: this.now(),
      };
    });
  }

  removeProduct(productId: string): void {
    this.updateActiveOrder(order => ({
      ...order,
      items: order.items.filter(item => item.product.id !== productId),
      checkoutTotalOverride: undefined,
      receivedAmount: undefined,
      updatedAt: this.now(),
    }));
  }

  clearActiveOrder(): void {
    this.updateActiveOrder(order => ({
      ...order,
      items: [],
      checkoutTotalOverride: undefined,
      receivedAmount: undefined,
      updatedAt: this.now(),
    }));
  }

  private updateActiveOrder(updater: (order: Order) => Order): boolean {
    return this.patchState(state => {
      const activeOrder = this.getActiveOrderFromState(state);

      if (!activeOrder) {
        return state;
      }

      const orders = state.orders.map(order => order.id === activeOrder.id ? updater(order) : order);
      return this.ensureActiveOrder({ ...state, orders });
    });
  }

  private updateOrder(orderId: string, updater: (order: Order) => Order): boolean {
    return this.patchState(state => {
      const exists = state.orders.some(order => order.id === orderId);
      if (!exists) {
        return state;
      }

      const orders = state.orders.map(order => order.id === orderId ? updater(order) : order);
      return this.ensureActiveOrder({ ...state, orders });
    });
  }

  private patchState(updater: (state: OrdersStorageV1) => OrdersStorageV1): boolean {
    const nextState = this.ensureActiveOrder(updater(this.stateSubject.value));

    if (!this.isEqualState(this.stateSubject.value, nextState)) {
      this.stateSubject.next(nextState);
      this.persist(nextState);
      return true;
    }

    return false;
  }

  private getActiveOrderFromState(state: OrdersStorageV1): Order | null {
    const activeOrder = state.orders.find(order => order.id === state.activeOrderId) ?? null;

    return activeOrder ? {
      ...activeOrder,
      items: this.cloneItems(activeOrder.items),
    } : null;
  }

  private getOrderById(orderId: string): Order | null {
    const order = this.stateSubject.value.orders.find(item => item.id === orderId) ?? null;

    return order ? {
      ...order,
      items: this.cloneItems(order.items),
    } : null;
  }

  private loadState(): OrdersStorageV1 {
    const fallback = this.ensureActiveOrder({
      version: 1,
      activeOrderId: null,
      orders: [],
    });

    const storage = this.getStorage();
    if (!storage) {
      return fallback;
    }

    const raw = storage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<OrdersStorageV1>;
      return this.ensureActiveOrder({
        version: 1,
        activeOrderId: parsed.activeOrderId ?? null,
        orders: Array.isArray(parsed.orders) ? this.cloneOrders(parsed.orders) : [],
      });
    } catch {
      storage.removeItem(this.STORAGE_KEY);
      return fallback;
    }
  }

  private persist(state: OrdersStorageV1): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private ensureActiveOrder(state: OrdersStorageV1): OrdersStorageV1 {
    const orders = state.orders.length > 0 ? state.orders : [this.createDefaultOrder()];
    const activeOrderId = orders.some(order => order.id === state.activeOrderId)
      ? state.activeOrderId
      : orders[0].id;

    return {
      version: 1,
      orders,
      activeOrderId,
    };
  }

  private createDefaultOrder(): Order {
    const now = this.now();
    return {
      id: this.createId(),
      label: 'Tisch 1',
      kind: 'table',
      items: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  private buildLabel(input: CreateOrderInput): string {
    const label = input.label?.trim();
    if (label) {
      return label;
    }

    switch (input.kind) {
      case 'bar':
        return 'Bar';
      case 'takeaway':
        return 'Takeaway';
      case 'custom':
        return 'Neue Bestellung';
      case 'table':
      default:
        return this.nextTableLabel();
    }
  }

  private nextTableLabel(): string {
    const highestTableNumber = this.stateSubject.value.orders
      .filter(order => order.kind === 'table')
      .map(order => {
        const match = /^Tisch\s+(\d+)$/i.exec(order.label);
        return match ? Number(match[1]) : 0;
      })
      .reduce((max, current) => Math.max(max, current), 0);

    return `Tisch ${highestTableNumber + 1}`;
  }

  private createId(): string {
    const crypto = globalThis.crypto;
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }

    return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private now(): string {
    return new Date().toISOString();
  }

  private normalizeMoneyValue(amount: number | null | undefined): number | undefined {
    if (amount == null || !Number.isFinite(amount)) {
      return undefined;
    }

    return Math.max(0, Math.round(amount * 100) / 100);
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private cloneOrders(orders: Order[]): Order[] {
    return orders.map(order => ({
      ...order,
      items: this.cloneItems(order.items),
    }));
  }

  private cloneItems(items: CartItem[]): CartItem[] {
    return items.map(item => ({
      product: { ...item.product },
      qty: item.qty,
    }));
  }

  private isEqualState(left: OrdersStorageV1, right: OrdersStorageV1): boolean {
    return JSON.stringify(left) === JSON.stringify(right);
  }
}



