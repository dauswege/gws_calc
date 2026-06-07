import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Price } from '../models/price';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private PRODUCT_KEY = 'products';
  private PRICE_KEY = 'prices';

  constructor() {
    this.initData();
  }

  private initData() {
    if (!localStorage.getItem(this.PRODUCT_KEY)) {
      const products: Product[] = [
        { id: '1', name: 'Bier', active: true },
        { id: '2', name: 'Wein', active: true },
        { id: '3', name: 'Hendl', active: true }
      ];
      localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(products));
    }

    if (!localStorage.getItem(this.PRICE_KEY)) {
      const prices: Price[] = [
        { id: 'p1', productId: '1', amount: 4.5, currency: 'EUR', validFrom: new Date().toISOString() },
        { id: 'p2', productId: '2', amount: 5, currency: 'EUR', validFrom: new Date().toISOString() },
        { id: 'p3', productId: '3', amount: 13.5, currency: 'EUR', validFrom: new Date().toISOString() }
      ];
      localStorage.setItem(this.PRICE_KEY, JSON.stringify(prices));
    }
  }

  getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(this.PRODUCT_KEY) || '[]');
  }

  getPrices(): Price[] {
    return JSON.parse(localStorage.getItem(this.PRICE_KEY) || '[]');
  }
}
