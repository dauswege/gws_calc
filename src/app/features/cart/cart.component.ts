import { Component, computed, effect, inject, signal } from '@angular/core';
import { CartItem } from '../../core/models/cart-item';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../core/services/cart.service';
import {Router} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  imports: [CurrencyPipe]
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly activeOrder = toSignal(this.cartService.activeOrderChanges(), {
    initialValue: this.cartService.getActiveOrder(),
  });
  protected readonly items = toSignal(this.cartService.itemsChanges(), {
    initialValue: this.cartService.getItems(),
  });
  protected readonly subtotal = toSignal(this.cartService.totalChanges(), {
    initialValue: this.cartService.getTotal(),
  });
  protected readonly totalQuantity = toSignal(this.cartService.totalQuantityChanges(), {
    initialValue: this.cartService.getTotalQuantity(),
  });
  protected readonly adjustedTotalInput = signal('');
  protected readonly receivedAmountInput = signal('');
  protected readonly editingAdjustedTotal = signal(false);
  protected readonly editingReceivedAmount = signal(false);
  protected readonly finalTotal = computed(() => {
    const parsed = this.parseMoney(this.adjustedTotalInput());
    if (parsed !== null) {
      return this.roundMoney(parsed);
    }

    return this.roundMoney(this.activeOrder()?.checkoutTotalOverride ?? this.subtotal());
  });
  protected readonly receivedAmount = computed(() => {
    const rawValue = this.receivedAmountInput().trim();
    if (rawValue) {
      const parsed = this.parseMoney(rawValue);
      return parsed === null ? null : this.roundMoney(parsed);
    }

    const storedAmount = this.activeOrder()?.receivedAmount;
    return storedAmount == null ? null : this.roundMoney(storedAmount);
  });
  protected readonly adjustmentAmount = computed(() =>
    this.roundMoney(this.finalTotal() - this.subtotal()),
  );
  protected readonly balanceDelta = computed(() => {
    const receivedAmount = this.receivedAmount();
    if (receivedAmount === null) {
      return null;
    }

    return this.roundMoney(receivedAmount - this.finalTotal());
  });
  protected readonly changeAmount = computed(() => {
    const delta = this.balanceDelta();
    return delta !== null && delta >= 0 ? delta : null;
  });
  protected readonly amountMissing = computed(() => {
    const delta = this.balanceDelta();
    return delta !== null && delta < 0 ? this.roundMoney(Math.abs(delta)) : null;
  });
  protected readonly hasAdjustedTotal = computed(() =>
    !this.areMoneyValuesEqual(this.finalTotal(), this.subtotal()),
  );
  protected readonly quickAdjustedTotals = computed(() => {
    const subtotal = this.roundMoney(this.subtotal());
    const nextWholeEuro = Math.ceil(subtotal);
    const nextFiveStep = this.ceilToStep(nextWholeEuro, 5);

    return Array.from(new Set([
      subtotal,
      this.roundMoney(nextWholeEuro),
      this.roundMoney(nextFiveStep),
      this.roundMoney(nextFiveStep + 5),
    ])).filter(amount => amount >= subtotal);
  });
  protected readonly quickReceivedAmounts = computed(() => {
    const finalTotal = this.finalTotal();
    const nextWholeEuro = Math.ceil(finalTotal);
    const nextFiveStep = this.ceilToStep(nextWholeEuro, 5);

    return Array.from(new Set([
      this.roundMoney(nextWholeEuro),
      this.roundMoney(nextFiveStep),
      this.roundMoney(nextFiveStep + 5),
      this.roundMoney(nextFiveStep + 10),
    ])).filter(amount => amount >= finalTotal);
  });

  constructor() {
    effect(() => {
      const activeOrder = this.activeOrder();
      const subtotal = this.subtotal();

      if (!this.editingAdjustedTotal()) {
        this.adjustedTotalInput.set(
          this.formatMoneyForInput(activeOrder?.checkoutTotalOverride ?? subtotal),
        );
      }

      if (!this.editingReceivedAmount()) {
        this.receivedAmountInput.set(this.formatOptionalMoneyForInput(activeOrder?.receivedAmount));
      }
    });
  }

  increase(cartItem: CartItem) {
    this.cartService.increase(cartItem.product.id);
  }

  decrease(cartItem: CartItem) {
    this.cartService.decrease(cartItem.product.id);
  }


  getItemPrice(item: CartItem): number {
    return (item.product.price ?? 0) * item.qty;
  }

  onAdjustedTotalFocus(): void {
    this.editingAdjustedTotal.set(true);
  }

  onAdjustedTotalInputChange(value: string): void {
    this.adjustedTotalInput.set(value);
  }

  onAdjustedTotalBlur(): void {
    this.editingAdjustedTotal.set(false);

    const subtotal = this.roundMoney(this.subtotal());
    const parsed = this.parseMoney(this.adjustedTotalInput());
    const normalized = parsed === null ? subtotal : this.roundMoney(parsed);

    this.applyAdjustedTotal(normalized);
  }

  resetAdjustedTotal(): void {
    this.editingAdjustedTotal.set(false);
    this.applyAdjustedTotal(null);
  }

  setQuickAdjustedTotal(amount: number): void {
    this.editingAdjustedTotal.set(false);
    this.applyAdjustedTotal(amount);
  }

  isQuickAdjustedTotalSelected(amount: number): boolean {
    return this.areMoneyValuesEqual(this.finalTotal(), amount);
  }

  onReceivedAmountFocus(): void {
    this.editingReceivedAmount.set(true);
  }

  onReceivedAmountInputChange(value: string): void {
    this.receivedAmountInput.set(value);
  }

  onReceivedAmountBlur(): void {
    this.editingReceivedAmount.set(false);

    const parsed = this.parseMoney(this.receivedAmountInput());
    this.cartService.setReceivedAmount(parsed);
    this.receivedAmountInput.set(this.formatOptionalMoneyForInput(parsed));
  }

  setQuickReceivedAmount(amount: number): void {
    const normalized = this.roundMoney(amount);

    this.editingReceivedAmount.set(false);
    this.cartService.setReceivedAmount(normalized);
    this.receivedAmountInput.set(this.formatMoneyForInput(normalized));
  }

  isQuickReceivedAmountSelected(amount: number): boolean {
    const receivedAmount = this.receivedAmount();
    return receivedAmount !== null && this.areMoneyValuesEqual(receivedAmount, amount);
  }

  readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | null)?.value ?? '';
  }

  clearCart() {
    this.cartService.clear();
    this.back();
  }

  protected back() {
    this.router.navigate(['/']);
  }

  private applyAdjustedTotal(amount: number | null): void {
    const subtotal = this.roundMoney(this.subtotal());
    const normalized = amount === null ? subtotal : this.roundMoney(amount);
    const override = this.areMoneyValuesEqual(normalized, subtotal) ? null : normalized;

    this.cartService.setCheckoutTotalOverride(override);
    this.adjustedTotalInput.set(this.formatMoneyForInput(override ?? subtotal));
  }

  private parseMoney(value: string | null | undefined): number | null {
    if (!value?.trim()) {
      return null;
    }

    const normalized = value
      .trim()
      .replace(/\s+/g, '')
      .replaceAll('€', '')
      .replaceAll(',', '.');

    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.max(0, parsed);
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private ceilToStep(value: number, step: number): number {
    if (step <= 0) {
      return this.roundMoney(value);
    }

    return Math.ceil(value / step) * step;
  }

  private formatMoneyForInput(value: number): string {
    return this.roundMoney(value).toFixed(2).replace('.', ',');
  }

  private formatOptionalMoneyForInput(value: number | null | undefined): string {
    return value == null ? '' : this.formatMoneyForInput(value);
  }

  private areMoneyValuesEqual(left: number, right: number): boolean {
    return Math.abs(left - right) < 0.005;
  }
}
