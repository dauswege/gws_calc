import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(private db: DbService) {}

  getPriceForProduct(productId: string): number | null {
    const prices = this.db.getPrices();

    const price = prices
      .filter(p => p.productId === productId)
      .sort((a, b) => new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime())[0];

    return price ? price.amount : null;
  }
}
