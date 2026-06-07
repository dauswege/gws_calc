import { Component, input, output } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item';
import { PriceService } from '../../../core/services/price.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  items = input<CartItem[]>([]);
  total = input<number>(0);

  increase = output<string>();
  decrease = output<string>();

  constructor(private priceService: PriceService) {}

  getItemPrice(item: CartItem): number {
    return (this.priceService.getPriceForProduct(item.product.id) ?? 0) * item.qty;
  }
}
