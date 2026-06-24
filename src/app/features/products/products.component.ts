import { Component, DestroyRef, inject } from '@angular/core';
import { DbService } from '../../core/services/db.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { Product } from '../../core/models/product';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent {
  private readonly db = inject(DbService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  products: Product[] = [];
  protected readonly total = toSignal(this.cart.totalChanges(), {
    initialValue: this.cart.getTotal(),
  });
  protected readonly totalQuantity = toSignal(this.cart.totalQuantityChanges(), {
    initialValue: this.cart.getTotalQuantity(),
  });

  constructor() {
    this.products = this.db.getProducts();

    this.db.productsChanges()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(products => {
        this.products = products;
      });
  }

  addToCart(product: any) {
    this.cart.add(product);
  }

  removeFromCart(productId: string) {
    this.cart.decrease(productId);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

}
