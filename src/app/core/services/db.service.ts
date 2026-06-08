import {Injectable} from '@angular/core';
import {Product} from '../models/product';
import {PRODUCTS} from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private PRODUCT_KEY = 'products';

  constructor() {
    this.initData();
  }

  private initData() {
    if (!localStorage.getItem(this.PRODUCT_KEY)) {
      localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(PRODUCTS));
    }
  }

  getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(this.PRODUCT_KEY) || '[]');
  }

  getPrices() {
    // Legacy method for compatibility - now prices are directly in products
    return this.getProducts().map(p => ({
      id: `p${p.id}`,
      productId: p.id,
      amount: p.price,
      currency: 'EUR',
      validFrom: new Date().toISOString()
    }));
  }
}
