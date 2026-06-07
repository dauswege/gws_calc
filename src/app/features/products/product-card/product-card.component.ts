import { Component, input, output, signal } from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {PriceService} from '../../../core/services/price.service';
import {Product} from '../../../core/models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  imports: [CurrencyPipe]
})
export class ProductCardComponent {
  product = input<any>();
  select = output<any>();
  remove = output<string>();

  constructor(private priceService: PriceService) {
  }
  isPressed = signal(false);
  private pressTimer: any;
  private readonly LONG_PRESS_DURATION = 1000; // 1 second

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

  getPrice(product: Product): number | null {
    console.log(`Getting price for product ${product.name} (ID: ${product.id})`);
    let price = this.priceService.getPriceForProduct(product.id);
    console.log(`Price for product ${product.name} (ID: ${product.id}): ${price}`);
    return price;
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
