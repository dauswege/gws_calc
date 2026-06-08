import { Component } from '@angular/core';
import { CartItem } from '../../core/models/cart-item';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../core/services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  imports: [CurrencyPipe]
})
export class CartComponent {

  constructor(private cartService: CartService, private router: Router) { }

  increase(cartItem: CartItem) {
    this.cartService.increase(cartItem.product.id);
  }

  decrease(cartItem: CartItem) {
    this.cartService.decrease(cartItem.product.id);
  }

  get total() : number {
    return this.cartService.getTotal();
  }

  get items() : CartItem[] {
    return this.cartService.getItems();
  }

  get totalQuantity(): number {
    return this.cartService.getTotalQuantity();
  }

  getItemPrice(item: CartItem): number {
    return (item.product.price ?? 0) * item.qty;
  }

  clearCart() {
    this.cartService.clear();
    this.back();
  }

  protected back() {
    this.router.navigate(['/']);
  }
}
