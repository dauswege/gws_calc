import {Component, input, output} from '@angular/core';
import {CartItem} from '../../../core/models/cart-item';
import {PriceService} from '../../../core/services/price.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <h3>Warenkorb</h3>

    @for (item of items(); track item.product.id) {
      <div class="cart-item">

        <div class="name">
          {{ item.product.name }}
        </div>

        <div class="controls">
          <button (click)="decrease.emit(item.product.id)">
            -
          </button>

          <span>{{ item.qty }}</span>

          <button (click)="increase.emit(item.product.id)">
            +
          </button>
        </div>

        <div class="price">
          {{ getItemPrice(item) }} €
        </div>

      </div>
    }

    <hr>

    <h3>Gesamt: {{ total() }} €</h3>
  `,
  styles: [`
    .cart-item {
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 8px;
    }

    button {
      width: 32px;
      height: 32px;
    }
  `]
})
export class CartComponent {

  items = input<CartItem[]>([]);
  total = input<number>(0);

  increase = output<string>();
  decrease = output<string>();

  constructor(private priceService: PriceService) {
  }

  getItemPrice(item: CartItem): number {
    return (this.priceService.getPriceForProduct(item.product.id) ?? 0) * item.qty;
  }
}
