import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-order-switcher',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './order-switcher.component.html',
  styleUrl: './order-switcher.component.scss',
})
export class OrderSwitcherComponent {
  private readonly orderService = inject(OrderService);

  protected readonly orders = toSignal(this.orderService.ordersChanges(), {
    initialValue: this.orderService.getOrders(),
  });

  protected readonly activeOrder = toSignal(this.orderService.activeOrderChanges(), {
    initialValue: this.orderService.getActiveOrder(),
  });

  protected readonly overviewOpen = signal(false);
  protected readonly newOrderLabel = signal('');
  protected renameDrafts: Record<string, string> = {};

  constructor() {}

  trackByOrderId(_: number, order: Order): string {
    return order.id;
  }

  isActive(orderId: string): boolean {
    return this.activeOrder()?.id === orderId;
  }

  createOrder(): void {
    const label = this.newOrderLabel().trim();

    this.orderService.createOrder({
      label: label || undefined,
      activate: true,
    });

    this.newOrderLabel.set('');
    this.overviewOpen.set(false);
  }

  switchTo(orderId: string): void {
    this.orderService.switchToOrder(orderId);
    this.overviewOpen.set(false);
  }

  deleteOrder(orderId: string): void {
    const order = this.orders().find(item => item.id === orderId);
    if (!order) {
      return;
    }

    const confirmed = window.confirm(`Bestellung "${order.label}" wirklich löschen?`);
    if (!confirmed) {
      return;
    }

    this.orderService.deleteOrder(orderId);
  }

  saveRename(orderId: string): void {
    const nextLabel = (this.renameDrafts[orderId] ?? '').trim();
    if (!nextLabel) {
      return;
    }

    this.orderService.renameOrder(orderId, nextLabel);
  }

  updateRenameDraft(orderId: string, value: string): void {
    this.renameDrafts[orderId] = value;
  }

  totalFor(orderId: string): number {
    return this.orderService.getOrderTotal(orderId);
  }

  quantityFor(orderId: string): number {
    return this.orderService.getOrderTotalQuantity(orderId);
  }

  activeLabel(): string {
    return this.activeOrder()?.label ?? 'Keine Bestellung';
  }

  toggleOverview(): void {
    this.overviewOpen.set(!this.overviewOpen());
  }

  closeOverview(): void {
    this.overviewOpen.set(false);
  }
}



