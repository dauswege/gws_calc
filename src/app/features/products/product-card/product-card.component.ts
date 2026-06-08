import { Component, input, output, signal, computed, OnDestroy } from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  imports: [CurrencyPipe]
})
export class ProductCardComponent implements OnDestroy {
  product = input<any>();
  quantity = input<number>(0); // Current quantity in cart
  select = output<any>();
  remove = output<string>();

  isPressed = signal(false);
  private pressTimer: any;
  private readonly LONG_PRESS_DURATION = 600; // 1 second

  hasQuantity = computed(() => this.quantity() > 0);

  onMouseDown() {
    this.isPressed.set(true);
    this.pressTimer = setTimeout(() => {
      this.handleLongPress();
    }, this.LONG_PRESS_DURATION);
  }

  onMouseUp() {
    this.isPressed.set(false);
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }

  onTouchStart() {
    this.isPressed.set(true);
    this.pressTimer = setTimeout(() => {
      this.handleLongPress();
    }, this.LONG_PRESS_DURATION);
  }

  onTouchEnd() {
    this.isPressed.set(false);
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }

  onTouchCancel() {
    this.isPressed.set(false);
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }

  onClick() {
    // Only trigger click if not a long press
    if (this.pressTimer) {
      this.select.emit(this.product());
    }
  }

  private handleLongPress() {
    this.remove.emit(this.product().id);
    this.isPressed.set(false);
  }

  ngOnDestroy() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }
}
