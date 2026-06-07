import { Component } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { CartService } from '../../core/services/cart.service';
import { PriceService } from '../../core/services/price.service';
import { ProductCardComponent } from './product-card/product-card.component';
import {Product} from '../../core/models/product';
import {CartComponent} from '../cart/cart.component/cart.component';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CartComponent, CurrencyPipe],
  templateUrl: './products.html'
})
export class ProductsComponent {



  cartItems: any[] = [];
  products: Product[];

  constructor(
    private db: DbService,
    private cart: CartService,
    private priceService: PriceService
  ) {
    this.products = this.db.getProducts();
  }

  addToCart(product: any) {
    this.cart.add(product);
    this.cartItems = this.cart.getItems();
  }

  removeFromCart(productId: string) {
    this.cart.decrease(productId);
    this.cartItems = this.cart.getItems();
  }

  increase(id: string) {
    this.cart.increase(id);
    this.cartItems = this.cart.getItems();
  }

  decrease(id: string) {
    this.cart.decrease(id);
    this.cartItems = this.cart.getItems();
  }

  getPrice(id: string) {
    return this.priceService.getPriceForProduct(id);
  }

  get total() {
    return this.cart.getTotal();
  }
}
