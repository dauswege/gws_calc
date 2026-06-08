import { Component } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from './product-card/product-card.component';
import {Product} from '../../core/models/product';
import {CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent {

  cartItems: any[] = [];
  products: Product[];

  constructor(
    private db: DbService,
    private cart: CartService,
    private router: Router
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


  get total() {
    return this.cart.getTotal();
  }

  get totalQuantity() : number {
    return this.cart.getTotalQuantity();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

}
