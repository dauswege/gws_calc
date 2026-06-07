import {Injectable} from '@angular/core';
import {Product} from '../models/product';
import {Price} from '../models/price';

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
        {id: '1', name: 'Bier 0,5', active: true},
        {id: '2', name: 'Radler 0,5', active: true},
        {id: '3', name: 'Spritzer 1/4', active: true},
        {id: '4', name: 'Sommerspritzer 1/2', active: true},
        {id: '5', name: 'Limo', active: true},
        {id: '6', name: 'Saft', active: true},
        {id: '7', name: 'Kaffee', active: true},
        {id: '8', name: 'Kuchen', active: true},
        {id: '9', name: 'Hendl', active: true},
        {id: '10', name: 'Schopf', active: true},
        {id: '11', name: 'Pommes', active: true},
        {id: '12', name: 'Was anderes', active: true}
      ];
      localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(products));
    }

    if (!localStorage.getItem(this.PRICE_KEY)) {
      const prices: Price[] = [
        {id: 'p1', productId: '1', amount: 4.90, currency: 'EUR', validFrom: new Date().toISOString()}, // Bier 0,5
        {id: 'p2', productId: '2', amount: 5.20, currency: 'EUR', validFrom: new Date().toISOString()}, // Radler 0,5
        {id: 'p3', productId: '3', amount: 3.90, currency: 'EUR', validFrom: new Date().toISOString()}, // Spritzer 1/4
        {id: 'p4', productId: '4', amount: 5.50, currency: 'EUR', validFrom: new Date().toISOString()}, // Sommerspritzer 1/2
        {id: 'p5', productId: '5', amount: 3.20, currency: 'EUR', validFrom: new Date().toISOString()}, // Limo
        {id: 'p6', productId: '6', amount: 3.50, currency: 'EUR', validFrom: new Date().toISOString()}, // Saft
        {id: 'p7', productId: '7', amount: 3.00, currency: 'EUR', validFrom: new Date().toISOString()}, // Kaffee
        {id: 'p8', productId: '8', amount: 4.20, currency: 'EUR', validFrom: new Date().toISOString()}, // Kuchen
        {id: 'p9', productId: '9', amount: 12.90, currency: 'EUR', validFrom: new Date().toISOString()}, // Hendl
        {id: 'p10', productId: '10', amount: 11.90, currency: 'EUR', validFrom: new Date().toISOString()}, // Schopf
        {id: 'p11', productId: '11', amount: 4.80, currency: 'EUR', validFrom: new Date().toISOString()}, // Pommes
        {id: 'p12', productId: '12', amount: 0.00, currency: 'EUR', validFrom: new Date().toISOString()}  // Was anderes (manuell)
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
